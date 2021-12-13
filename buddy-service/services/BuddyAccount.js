const { Buddy } = require('../models/Buddy');

async function lookupbalance() {
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