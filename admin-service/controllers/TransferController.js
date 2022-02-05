const transferService = require('../services/Transfer');

async function transfer(req, res){
    try {
        const response = await transferService.transfer(req.body);
        return res.send({
            success: true,
            response
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function history(req, res){
    try {
        const response = await transferService.history(req.body.user_id);
        return res.send({
            success: true,
            response
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

module.exports = {
    transfer,
    history
}