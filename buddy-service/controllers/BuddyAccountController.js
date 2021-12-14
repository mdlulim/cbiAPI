const buddyAccountService = require('../services/BuddyAccount');

async function lookupbalance(req, res) {
    try {
        const allBuddyAccounts = await buddyAccountService.lookupbalance();
        res.send(allBuddyAccounts);
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function lookupaccount(req, res) {
    try {
        const account = await buddyAccountService.lookupaccount();
        res.send(account)
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function lookuptransactions(req, res) {
    try {
        const allBuddyAccounts = await buddyAccountService.index();
        res.send(allBuddyAccounts);
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function eventtransfer(req, res) {
    try {
        const transfer = await buddyAccountService.eventtransfer();
        res.send(transfer);
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}



module.exports = {
    lookupbalance,
    lookuptransactions,
    lookupaccount,
    eventtransfer
}