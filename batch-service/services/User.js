const sequelize = require('../config/db');
const { User } = require('../models/User');
const { Transaction } = require('../models/Transaction');
const { Fee } = require('../models/Fee');
const { BatchTransaction } = require('../models/BatchTransaction');
const { Account } = require('../models/Account');
Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
Account.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
User.hasOne(Account, { foreignKey: 'user_id', targetKey: 'id' });

async function showTransaction(data) {
    try {
        return Transaction.findOne({
            where: { txid: data.txid },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function showFile(data) {
    try {
        return Transaction.findOne({
            where: { txid: data.txid },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function process(data) {
  
    try {
            if(data.subtype.toLowerCase() === "withdraw"){
                const transaction = await Transaction.findOne({
                    attributes: [
                        'currency',
                        'status',
                        'amount',
                        'fee'
                    ],
                    where : {  
                        txid: data.txid,
                    },
                    include : [{
                        attributes: [
                            'first_name',
                            'email',
                            'id',
                        ],
                        model: User,
                        where: {
                            referral_id: data.referral_id
                        },
                        include : [{
                            attributes: [
                                'id',
                                'available_balance',
                                'balance',
                            ],
                            model: Account
                        }]
                    }]
                });
                let resData = {}
                const {
                    user,
                    currency,
                    fee,
                    id,
                    amount,
                    status
                } = transaction;

                const {
                    first_name,
                    email,
                    account
                } = user;

                const withdrawalAmount = parseFloat(amount) + parseFloat(fee);
                const condition = {id: account.id};
                if(parseFloat(data.status) === 0){
                    if(status !== 'Completed'){
                        const debit = {balance: parseFloat(account.balance) - withdrawalAmount};
                        const updateData = {status: 'Completed'}
                        resData = {
                            first_name: first_name,
                            email: email,
                            status: data.status,
                            amount: withdrawalAmount,
                            currency_code: currency.code,
                            reference: data.txid
                        }

                        Account.update( debit, {where: condition})
                        await Transaction.update(updateData, {
                            where: { txid: data.txid }
                        });
                    }

                }else{
                    if(status != 'Completed'){
                        const credit = {available_balance: parseFloat(account.available_balance) + withdrawalAmount};
                        resData = {
                            first_name: first_name,
                            email: email,
                            status: data.status,
                            amount: withdrawalAmount,
                            currency_code: currency.code,
                            reference: data.txid
                        }
                        Account.update( credit, {where: condition})
                        const updateData = {status: 'Rejected'}
                        await Transaction.update(updateData, {
                            where: { txid: data.txid }
                        });
                    }
                }
                return { success: true, message: 'Transaction was successfully modify', data: resData };
            }
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

async function updateBatchStatus(id, data) {
    try {
        await BatchTransaction.update({
            file_status: data.status,
            updated: sequelize.fn('NOW'),
        }, { where: { id } });
        return { success: true, message: 'Successfully modify' };
    } catch (error) {
        //console.error(error || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Sets transaction state
  */
async function updateTransaction(data) {
    try {
        const result = await sequelize.transaction(async (transaction) => {
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


/**
 * List Users
 * 
 * Get a list of users belonging to CBI.
 * 
 * @param {object} query
 * @returns
 */
async function status(query) {
    try {
        const users = await User.findAndCountAll({
        });
        const { count, rows } = users;
        return {
            success: true,
            data: {
                count,
                results: rows,
            }
        };
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    process,
    status,
    showTransaction,
    updateBatchStatus,
    updateTransaction,
}
