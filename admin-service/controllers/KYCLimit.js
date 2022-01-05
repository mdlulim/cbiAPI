const KYCLimit = require('../services/KYCLimit');

async function create(req, res) {
    let data = req.body;
    try {
        return await KYCLimit.create(data)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function index(req, res) {
    try {
        const limits = await KYCLimit.index(req.query);
        const { count, rows } = limits;
        return res.send({
            success: true,
            data: {
                count,
                results: rows,
            }
        });
    } catch (error) {
        console.log(error);
        return res.send({
            success: false,
            message: 'Could not process request 02'
        });
    }
}

async function show(req, res) {
    try {
        const bankAccount = await KYCLimit.show(req.params.id);
        return res.send({
            success: true,
            data: bankAccount
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
        await KYCLimit.update(req.params.id, req.body);

        return res.send({
            success: true, message: 'KYC Limit was successfully updated'
        });
    } catch (error) {
        return {
            success: false,
            message: 'Could not process request'
        };
    }
}

async function destroy(req, res) {
    try {
        return KYCLimit.destroy(req.params.id)
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