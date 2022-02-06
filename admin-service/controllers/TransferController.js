const transferService = require('../services/Transfer');
const transactionService = require('../services/Transaction');

const getTxid = (subtype, autoid) => {
    return subtype.substr(0, 3).toUpperCase() + autoid.toString();
};

async function transfer(req, res){
    try {
        const admin_user_id = req.user.id;
        const response = await transferService.transfer(req.body, admin_user_id,);
        const subtype= response.transaction.dataValues.subtype;
        const auto_id= response.transaction.dataValues.auto_id;
        const txid = getTxid(subtype, auto_id);
        const id = response.transaction.dataValues.id;
        let transData = { txid: txid, status: 'Completed' }
        await transactionService.update(transData, id);
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
        const response = await transferService.history(req.query);
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