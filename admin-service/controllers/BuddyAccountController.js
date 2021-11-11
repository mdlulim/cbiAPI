const buddyAccountService = require('../services/BuddyAccount');

async function store(req, res) {
    try {
        let data = {
            buddy_identifier: req.body.buddy_identifier,
            created: req.body.created,
            updated: req.body.updated,
            user_id: req.user.id
        }
        await buddyAccountService.store(data);
        res.status(200).send({
            status: 200,
            message: 'resource created successfully'
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function index(req, res) {
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

async function show(req, res) {
    try {
        const buddyAccount = await buddyAccountService.show(req.params.buddyId);
        res.send(buddyAccount);
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function update(req, res) {
    try {
        let data = {
            buddy_identifier: req.body.buddy_identifier,
            created: req.body.created,
            updated: req.body.updated,
            id: req.params.buddyId
        }
        await buddyAccountService.update(data);
        res.status(200).send({
            success: true,
            message: 'resource update successfully'
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function destroy(req, res) {
    try {
        await buddyAccountService.destroy(req.params.buddyId);
        res.status(200).send({
            success: true,
            message: 'resource deleted successfully'
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}


module.exports = {
    store,
    index,
    show,
    update,
    destroy
}