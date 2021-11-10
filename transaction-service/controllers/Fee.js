const feeService = require('../services/Fee');

async function show(req, res){
    try {
        const { tx_type, subtype } = req.params;
        const fee = await feeService.show(tx_type, subtype);
        res.send({
            success: true,
            data: fee,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
};

module.exports = {
    show,
};
