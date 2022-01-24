const transferService = require('../services/Transfer');

async function transfer(req, res){
    try {
        console.log("Test mdu================================================")
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

module.exports = {
    transfer
}