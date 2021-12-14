const sequelize = require('../config/db');
const { Account } = require('../models/Account');
const { Buddy } = require('../models/Buddy');

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
                env: 'staging',
                version: '1.0.0',
                timestamp: Date.now(),
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

async function lookupaccount() {
    try {    
        return {
            code: 200,
            success: true,
            data: {
                entity: 'BUDDY',
                path: 'account',
                env: 'staging',
                version: '1.0.0',
                timestamp: "2021-12-13T16:34:01.864572Z",
                data: {
                    account: '90000266',
                    active: true
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

async function eventtransfer() {
    try {
        return {
            code: 200,
            success: true,
            data: {
                entity: 'BUDDY',
                path: 'transfer',
                env: 'staging',
                version: '1.0.0',
                timestamp: Date.now(),
                data: {
                    id: 5,
                    status: 'COMPLETED',
                    reference: 'SUCCEED',
                    created_at: '2021-10-14T12:25:25.000000Z',
                    debit_completed: 1,
                    credit_completed: 0,
                    message: '4 CBI voucher issued from Buddy to 90000266. Reference: ABC4'
                }
            },
            message: 'Successful Transaction'  
        }
    } catch (error) {
        console.log('test')
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