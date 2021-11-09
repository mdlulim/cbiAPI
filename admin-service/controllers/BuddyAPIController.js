const buddyService = require('../services/BuddyAPI');

async function lookupBalance(req, res){
    try {
        const buddybalance = await buddyService.lookupBalance();
        res.send(buddybalance)
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        })
    }
};

async function lookupAccount(req, res){
    try {
        const buddybalance = await buddyService.lookupAccount(req.body.identifier);
        res.send(buddybalance)
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        })
    }
};

async function lookupTransaction(req, res) {
    try {
        let data = {
            search: req.body.search,
            from: req.body.from,
            to: req.body.to,
            perPage: req.body.perPage,
            page: req.body.page
        }
        const buddyTransactions = await buddyService.lookupTransaction(data);
        res.send(buddyTransactions)
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        })
    }
}

async function eventTransfer(req, res) {
    try {
        let data = {
            user_id: req.user.id,
            amount: req.body.amount,
            currency: req.body.currency,
        }
        const eventTransfer = await buddyService.eventTransfer(data);
        res.send(eventTransfer)
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        })
    }
}

module.exports = {
    lookupBalance,
    lookupAccount,
    lookupTransaction,
    eventTransfer
}