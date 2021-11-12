const cryptoAccountService = require('../services/CryptoAccount');
const activityService = require('../services/Activity');

async function create(req, res) {
    try {
        return cryptoAccountService.create(req.body)
        .then(async () => {
            await activityService.add({
                user_id: req.user.id,
                action: `${req.user.group_name.toLowerCase()}.crypto-account.add`,
                description: `${req.user.first_name} added new crypto account`,
                section: 'Profile',
                subsection: 'Crypto Accounts',
                data: { data: req.body },
                ip: null,
            });
            return res.send({ success: true });
        })
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
        const accounts = await cryptoAccountService.index(req.user.id);
        const { count, rows } = accounts;
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

async function show(req, res) {
    try {
        const account = await cryptoAccountService.show(req.params.id);
        return res.send({
            success: true,
            data: account,
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
        return cryptoAccountService.update(req.params.id, req.body)
        .then(async () => {
            await activityService.add({
                user_id: req.user.id,
                action: `${req.user.group_name.toLowerCase()}.crypto-account.update`,
                description: `${req.user.first_name} updated crypto account`,
                section: 'Profile',
                subsection: 'Crypto Accounts',
                data: { id: req.params.id, data: req.body },
                ip: null,
            });
            return res.send({ success: true });
        })
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

async function destroy(req, res) {
    try {
        return cryptoAccountService.destroy(req.params.id)
        .then(async () => {
            await activityService.add({
                user_id: req.user.id,
                action: `${req.user.group_name.toLowerCase()}.crypto-account.delete`,
                description: `${req.user.first_name} deleted crypto account`,
                section: 'Profile',
                subsection: 'Crypto Accounts',
                data: { id: req.params.id },
                ip: null,
            });
            return res.send({ success: true });
        })
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

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
};
