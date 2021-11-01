const userService = require('../services/User');

async function create(req, res) {
    try {
        return userService.create(req.body)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function index(req, res) {
    try {
        return userService.index(req.query)
        .then(data => res.send(data))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function show(req, res) {
    try {
        return userService.show(req.params.id)
        .then(data => res.send(data))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function update(req, res) {
    try {
        return userService.update(req.params.id, req.body)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function archive(req, res) {
    try {
        return userService.archive(req.params.id)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function block(req, res) {
    try {
        return userService.block(req.params.id)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function unarchive(req, res) {
    try {
        return userService.unarchive(req.params.id)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function unblock(req, res) {
    try {
        return userService.unblock(req.params.id)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function products(req, res) {
    try {
        return userService.products(req.params.id)
        .then(data => res.send(data))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function referrals(req, res) {
    try {
        const referrals = await userService.referrals(req.params.id);
        const { count, rows } = referrals;
        return res.send({
            success: true,
            data: {
                count,
                results: rows,
            },
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function transactions(req, res){
    try {
        return userService.transactions(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function addresses(req, res){
    try {
        return userService.addresses(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function emails(req, res){
    try {
        return userService.emails(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function mobiles(req, res){
    try {
        return userService.mobiles(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function bankAccounts(req, res){
    try {
        return userService.bankAccounts(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function cryptoAccounts(req, res){
    try {
        return userService.cryptoAccounts(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

module.exports = {
    create,
    index,
    show,
    update,
    archive,
    block,
    unarchive,
    unblock,
    products,
    referrals,
    transactions,
    addresses,
    emails,
    mobiles,
    bankAccounts,
    cryptoAccounts,
}
