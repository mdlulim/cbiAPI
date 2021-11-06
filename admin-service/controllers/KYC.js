const kycService = require('../services/KYC');

async function index(req, res) {
    try {
        const applications = await kycService.index(req.query);
        const { count, rows } = applications;
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
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
        const application = await kycService.show(req.params.id);
        return res.send({
            success: true,
            data: application
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    index,
    show,
};