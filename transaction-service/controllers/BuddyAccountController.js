const buddyAccountService = require('../services/BuddyAccount');

async function store(req, res) {
    try {
        let data = {
            buddy_identifier: req.body.buddy_identifier,
            created: req.body.created,
            updated: req.body.updated  
        }
        const buddyAccount = await buddyAccountService.store(data);
        res.send(buddyAccount);
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

module.exports = {
    store
}