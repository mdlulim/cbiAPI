const feeService = require('../services/Fee');

function show(req, res){
    try {
        const fee = await feeService.show(req.params.tx_type, req.params.subtype);
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
