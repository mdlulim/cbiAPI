const commissionService = require('../services/Commission');

async function total(req, res) {
    try {
        const total = await commissionService.total(req.user.id, req.params.type);
        return res.send({
            success: true,
            data: total
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    total,
};