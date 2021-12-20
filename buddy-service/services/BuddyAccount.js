const sequelize = require('../config/db');
const { Account } = require('../models/Account');
const { Buddy } = require('../models/Buddy');
const moment = require('moment');
const { buddyTransaction } = require('../models/BuddyTransaction');

async function lookupbalance() {
    try {
        data = await Account.findOne({
            where: {
                id: 'f06f4a4e-d7e4-471c-972a-2f0200d5471f'
            }
        })
        return {
            code: 200,
            success: true,
            data: {
                entity: 'BUDDY',
                path: 'balance',
                env: 'develop',
                version: '1.0.0',
                timestamp: moment().format(),
                data: {
                        "name": "BUDDY",
                        "type": "CRYPTO",
                        "currency": "CBI",
                        "balance": data.balance
                },
                message: 'ok'
            }
        }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function lookupaccount(data) {
    try {
        const reference = await Account.findOne({
            where: {
                reference: data
            }
        })
        return {
            code: 200,
            success: true,
            data: {
                entity: 'BUDDY',
                path: 'account',
                env: 'develop',
                version: '1.0.0',
                timestamp: moment().format(),
                data: {
                    user_reference_id: data,
                    active: (reference) ? true : false
                }
            },
            message: 'OK'
        }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function lookuptransactions() {
    try {
        const allbuddyAccounts = await Buddy.findAll();
        return {
            code: 200,
            status: 'OK',
            data: {
                allbuddyAccounts
            }
        }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function eventtransfer(data) {
    try {
        let identifier = await Account.findOne({
            where: {
                reference: data.identifier
            }
        })
        if(!identifier) {
            return {
                message: 'CBI member does not exist'
            }
        }

        const getBalance = await Account.findOne({
            where: {
                id: 'f06f4a4e-d7e4-471c-972a-2f0200d5471f'
            }
        })

        let newAvaliable = getBalance.available_balance - data.amount;
        let newBalance = getBalance.balance - data.amount;

        await Account.update({
            balance: newBalance,
            available_balance: newAvaliable
        }, {
            where: {
                id: 'f06f4a4e-d7e4-471c-972a-2f0200d5471f'
            }
        })

        newAvaliable = identifier.available_balance + data.amount;
        newBalance = identifier.balance + data.amount;

        await Account.update({
            balance: newBalance,
            available_balance: newAvaliable
        }, {
            where: {
                reference: data.identifier
            }
        })

        try {
            await buddyTransaction.create({
                user_id: identifier.user_id,
                note: `${data.amount} CBI voucher issued from Buddy to ${data.identifier}. Reference: ${data.reference}`,
                reference: data.reference,
                amount: data.amount,
                currency: 'CBI',
                status: 'COMPLETED',
                tx_type: 'credit',
                subtype: 'from buddy'
            })
        } catch (error) {
            console.error(error.message || null);
            throw new Error('Error was processing request');
        }

        return {
            code: 200,
            success: true,
            data: {
                entity: 'BUDDY',
                path: 'transfer',
                env: 'develop',
                version: '1.0.0',
                timestamp: moment().format(),
                data: {
                    id: 5,
                    status: 'COMPLETED',
                    reference: 'SUCCEED',
                    created_at: moment().format(),
                    debit_completed: 1,
                    credit_completed: 0,
                    message: `${data.amount} CBI voucher issued from Buddy to ${data.identifier}. Reference: ${data.reference}`
                }
            },
            message: 'Successful Transaction'  
        }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    lookupaccount,
    lookupbalance,
    lookuptransactions,
    eventtransfer
}