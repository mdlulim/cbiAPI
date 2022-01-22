const reportService = require('../services/Report');

async function index(req, res) {
    try {
        const reports = await reportService.index(req.query);
        const { count, rows } = reports;
        return res.send({
            success: true,
            data: {
                count,
                results: rows,
            }
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function show(req, res) {
    try {
        const report = await reportService.show(req.params.id);
        return res.send({
            success: true,
            data: report
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function generate(req, res) {
    try {
        const results = await reportService.generate(req.params.id);
        return res.send({
            success: true,
            data: {
                results,
            }
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    index,
    show,
    generate,
};