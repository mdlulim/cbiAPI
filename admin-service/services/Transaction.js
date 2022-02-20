const sequelize = require('../config/db');
const { Transaction } = require('../models/Transaction');
const { User } = require('../models/User');
const { Document } = require('../models/Document');
const { Account }  = require('../models/Account');
const { Fee } = require('../models/Fee');
const { Group } = require('../models/Group');

User.hasMany(Transaction, {foreignKey: 'user_id', targetKey: 'id'});
Transaction.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});
User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });

async function index(query) {
    try {
        const { Op } = sequelize;
        const { offset, limit, start_date, end_date } = query;
        const where = query || {};
        const userWhere = {};
        delete where.offset;
        delete where.limit;
        delete where.start_date;
        delete where.end_date;

        if (where.user) {
            userWhere.id = where.user;
            delete where.user;
        }
        if(start_date && end_date){
            where.created = { [Op.between]: [new Date(start_date), new Date(end_date)] }
        }
        const results = Transaction.findAndCountAll({
            where,
            include: [{ model: User, where: userWhere }],
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
        });
        console.log(results);
        return results;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
    
}

async function show(id) {
    try {
        return Transaction.findOne({
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function create(data) {
    try {
        return Transaction.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request of creating request');
    }
}

async function creditWallet(id, data) {
    try {
        const account =  await Account.findOne({where : {id: data.account_id}});
        const mainAccount =  await Account.findOne({where : {id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'}});
            if(account){
                let credit = {available_balance: parseFloat(account.available_balance)+parseFloat(data.amount)};
                let accountCondition = {id: data.account_id}
                Account.update( credit,{where: accountCondition})
            }

            if(mainAccount){
                let debit = {available_balance: parseFloat(mainAccount.available_balance)-parseFloat(data.amount)};
                let mainAccountCondition = {id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'}
                Account.update(debit, {where: mainAccountCondition})
            }
        return { success: true };
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

async function debitWallet(id, data) {
    try {
        const account =  await Account.findOne({where : {id: data.account_id}});
        const mainAccount =  await Account.findOne({where : {id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'}});
            if(account){
                let debit = {available_balance: parseFloat(account.available_balance)-parseFloat(data.amount)};
                let accountCondition = {id: data.account_id}
                Account.update( debit,{where: accountCondition})
            }

            if(mainAccount){
                let credit = {available_balance: parseFloat(mainAccount.available_balance)+parseFloat(data.amount)};
                let mainAccountCondition = {id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'}
                Account.update( credit, {where: mainAccountCondition})
            }
        return { success: true };
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}


async function update(data, id) {
    try {
        return Transaction.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function allTransactions(user_id, query) {
    try {

        const { count, rows } = await User.findAndCountAll({
            order: [[ 'created', 'DESC' ]],
            include: Transaction
        });
        return {
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        };
    } catch (error) {
        console.error(error.message || null);
    }
}

async function getProofOfPayment(txid) {
    try {
        return Document.findAndCountAll({
            where: { 'metadata': {'txid': txid}},
            order: [['created', 'DESC']]
        });
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

async function transactions(query, data) {
    try {
        const { offset, limit } = query;
        const where = query || {};
        const userWhere = {};
        delete where.offset;
        delete where.limit;

        if (where.user) {
            userWhere.id = where.user;
            delete where.user;
        }
        const Op = sequelize.Op;
        return Transaction.findAndCountAll({
            where: {
                status: "Completed",
                created: { [Op.between]: [data.start_date, data.end_date] },  },
            include: [
                {
                    attributes: [
                        'first_name',
                        'last_name',
                        'referral_id',
                        'email',
                        'id',
                    ],
                    model: User, 
                    where: userWhere }],
                    order: [['created', 'DESC']],
                    offset: offset || 0,
                    limit: limit || 100,
        });
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

async function transactionstotal(data) {
    const dateRange = data;
    try {
        const Op = sequelize.Op;
       const  deposit = await Transaction.sum('fee', {
            where: {
                subtype: "deposit",
                status: "Completed",
                created: { [Op.between]: [dateRange.start_date, dateRange.end_date] },
             }
        })
        const  withdraw = await Transaction.sum('fee', {
            where: {
                subtype: "withdraw",
                status: "Completed",
                created: { [Op.between]: [dateRange.start_date, dateRange.end_date] },
             }
        })

        const  transfer = await Transaction.sum('fee', {
            where: {
                subtype: "transfer",
                status: "Completed",
                created: { [Op.between]: [dateRange.start_date, dateRange.end_date] },
         }
        })

        const  product = await Transaction.sum('fee', {
            where: {
                subtype: "product",
                status: "Completed",
                created: { [Op.between]: [dateRange.start_date, dateRange.end_date] },
         },
        })
        const  registration = await Transaction.sum('amount', {
            where: {
                subtype: "registration",
                status: "Completed",
                created: { [Op.between]: [dateRange.start_date, dateRange.end_date] },
             }
        })
        const data = {
            deposit     : deposit ? deposit : 0,
            withdraw  : withdraw ? withdraw: 0,
            transfer    : transfer ? transfer : 0,
            product     : product ? product: 0,
            registration: registration ? registration: 0,
            total       : (deposit ? deposit : 0) + (withdraw ? withdraw: 0) + (transfer ? transfer : 0) + (product ? product: 0)
        }
        return { data: data }
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}


async function updateBulk(data) {
    try {
        let myData = {}
        const id = data.id;
        const transaction = await Transaction.findOne({where : {id: data.id}});
        const user =  await User.findOne({where : {id: transaction.user_id}});
        const user_id = user.id;
        const subtype = transaction.subtype.charAt(0).toUpperCase() + transaction.subtype.slice(1);
        const fee =  await Fee.findOne({where : {subtype: subtype, group_id: user.group_id} });
       
        if(!fee.value){
           return {success: false, message: 'Transaction fee is not configured!'}
       }

       if(transaction.status === 'Completed' || transaction.status === 'Rejected'){
            return {success: false, message: 'Transaction have already been processed'}
        }

        if(data.status === 'Completed' && transaction.status === 'Pending'){
            myData = {
                status: data.status,
                approval_reason: data.reason,
                approved_by: data.admin_user_id
            }
            const mainAccount =  await Account.findOne({where : {id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'}});
            const userWallet =  await Account.findOne({
                where: { user_id },
            });
            let isBalance = isNaN(userWallet.available_balance);
            let available_balance = userWallet.available_balance;
            if (isBalance) {
                available_balance = 0;
            }

            if (transaction.subtype.toLowerCase() === 'deposit') {
                //console.log("subtype: "+transaction.subtype)
                let credit = {
                    available_balance: parseFloat(mainAccount.available_balance) + parseFloat(fee.value),
                    balance: parseFloat(mainAccount.balance) + parseFloat(fee.value)
                };
                let mainAccountCondition = { id: mainAccount.id }
                await Account.update(credit, { where: mainAccountCondition })

                let creditUser = {
                    available_balance: parseFloat(available_balance) + parseFloat(transaction.amount) - parseFloat(fee.value),
                    balance: parseFloat(available_balance) + parseFloat(transaction.amount) - parseFloat(fee.value)
                };
                let accountCondition = { id: userWallet.id }
                await Account.update(creditUser, { where: accountCondition })

            }else if(transaction.subtype.toLowerCase() === "withdraw"){
                console.log("subtype: "+transaction.subtype)
                let credit = {
                    available_balance: parseFloat(mainAccount.available_balance) + parseFloat(fee.value),
                    balance: parseFloat(mainAccount.balance) + parseFloat(fee.value)
                };
                let mainAccountCondition = { id: mainAccount.id }
                await Account.update(credit, { where: mainAccountCondition })

                let creditUser = {
                    available_balance: parseFloat(available_balance) + parseFloat(transaction.amount) - parseFloat(fee.value),
                    balance: parseFloat(available_balance) + parseFloat(transaction.amount) - parseFloat(fee.value)
                };
                let accountCondition = { id: userWallet.id }
                await Account.update(creditUser, { where: accountCondition })
            }
            await Transaction.update(myData, {
                where: { id }
            });
            return {
                success: true,
                message: 'Transaction was updated successfully',
                data: {
                    status: data.status,
                    first_name: user.first_name,
                    email: user.email,
                    subtype: transaction.subtype,
                    tx_type: transaction.tx_type,
                    amount: transaction.amount,
                    fee: fee.value,
                    reference: transaction.reference,
                    currency_code: transaction.currency.code,
                }
            };
        }else{
            myData = {
                status: data.status,
                rejection_reason: data.reason,
                rejected_by: data.admin_user_id
            }
            await Transaction.update(myData, {
                where: { id }
            });
            return {
                success: true,
                message: 'Transaction was updated successfully',
                data: {
                    status: data.status,
                    first_name: user.first_name,
                    email: user.email,
                    subtype: transaction.subtype,
                    tx_type: transaction.tx_type,
                    amount: transaction.amount,
                    fee: fee.value,
                    reference: transaction.reference,
                    currency_code: transaction.currency.code,
                }
            };
        }

    } catch (error) {
        console.log(error)
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function createBatch(data) {
    try {
        await sequelize.transaction(async (transaction) => {
            data.forEach(async(row) => {
                console.log(row)
                await Transaction.update({
                    status: row.status,
                }, { where: { txid: row.txid }, transaction });
            })
        })
        
        return { success: true, message: 'Successfully modified' };
    } catch (error) {
        //console.error(error || null);
        throw new Error('Could not process your request');
    }
}




module.exports = {
    index,
    show,
    create,
    update,
    creditWallet,
    debitWallet,
    allTransactions,
    getProofOfPayment,
    transactions,
    transactionstotal,
    updateBulk,
    createBatch
}