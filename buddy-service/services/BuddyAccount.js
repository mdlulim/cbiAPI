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
                }
            }
        }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function lookupaccount() {
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

module.exports = {
    lookupaccount,
    lookupbalance,
    lookuptransactions,
    eventtransfer
}