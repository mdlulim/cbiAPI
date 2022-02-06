const moment = require('moment');
const { Account } = require('../models/Account');
const { Currency } = require('../models/Currency');
const { Transaction } = require('../models/Transaction');
const { User } = require('../models/User');

Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function transfer(data, admin_user_id) {
    try {
        const account =  await Account.findOne({where : { id: data.wallet_id}});
        const currency =  await Currency.findOne({where : { code: 'CBI'}});
        const mainAccount =  await Account.findOne({where : { id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'}});
        if (data.type === "credit") {
            let newmainAvaliable = parseFloat(mainAccount.available_balance) - parseFloat(data.amount);
            let newmainBalance = parseFloat(mainAccount.balance) - parseFloat(data.amount);

            let newaccountAvaliable = parseFloat(account.available_balance) + parseFloat(data.amount);
            let newaccountBalance = parseFloat(account.balance) + parseFloat(data.amount);

            account.update({
                balance: newaccountBalance,
                available_balance: newaccountAvaliable 
            }, {
                where: {
                    user_id: data.user_id
                }
            })
            await Account.update({
                balance: newmainBalance,
                available_balance: newmainAvaliable
            }, {
                where: {
                    id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'
                }
            })
            const transaction = await Transaction.create({
                tx_type: "credit",
                subtype: "admin-credit",
                note: "Admin Wallet Transfer (Credit)",
                status: "Completed",
                approval_reason: data.reason,
                label: "admin-transfer",
                currency: currency,
                user_id: account.user_id,
                amount: parseFloat(data.amount),
                approval_reason: data.reason,
                approved_by: admin_user_id,
            });

            return {
                success: true,
                message: `account ${data.user_id} has been credited with ${parseFloat(data.amount)} CBI on ${moment().format()}`,
                transaction
            }

        } else if (data.type === "debit") {
            let newmainAvaliable = parseFloat(mainAccount.available_balance) + parseFloat(data.amount);
            let newmainBalance = parseFloat(mainAccount.balance) + parseFloat(data.amount);

            let newaccountAvaliable = parseFloat(account.available_balance) - parseFloat(data.amount);
            let newaccountBalance = parseFloat(account.balance) - parseFloat(data.amount);

            account.update({
                balance: newaccountBalance,
                available_balance: newaccountAvaliable 
            }, {
                where: {
                    user_id: data.user_id
                }
            })
            Account.update({
                balance: newmainBalance,
                available_balance: newmainAvaliable
            }, {
                where: {
                    id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'
                }
            });
          
            const transaction = await Transaction.create({
                tx_type: "debit",
                subtype: "admin-debit",
                note: "Admin Wallet Transfer (Debit)",
                status: "Completed",
                approval_reason: data.reason,
                label: "admin-transfer",
                currency: currency,
                user_id: account.user_id,
                amount: parseFloat(data.amount),
                approval_reason: data.reason,
                approved_by: admin_user_id,
            });

            return {
                success: true,
                message: `account ${data.user_id} has been debited with ${parseFloat(data.amount)} CBI on ${moment().format()}`,
                transaction
            }
        } else {
            
        }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function history(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};
        const userWhere = {};
        delete where.offset;
        delete where.limit;

        const response = await Transaction.findAll({
            where: {
                label: "admin-transfer"
            },
            include : [{
                attributes: [
                    'first_name',
                    'last_name',
                    'referral_id',
                    'email',
                    'id',
                ],
                model: User,
            }],
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
        })
        return {
            code: 200,
            status: 'OK',
            data: {
                response
            }
        }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}



module.exports = {
    transfer,
    history
}