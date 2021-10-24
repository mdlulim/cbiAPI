const mobileNumberService = require('../services/MobileNumber');

async function create(req, res) {
    try {
        return mobileNumberService.create(req.body)
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
        const mobiles = await mobileNumberService.index(req.user.id);
        const { count, rows } = mobiles;
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
        const mobile = await mobileNumberService.show(req.params.id);
        return res.send({
            success: true,
            data: mobile,
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
        return mobileNumberService.update(req.params.id, req.body)
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

async function destroy(req, res) {
    try {
        return mobileNumberService.destroy(req.params.id)
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

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
};
