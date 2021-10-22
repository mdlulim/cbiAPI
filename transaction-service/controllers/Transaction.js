const transactionService    = require('../services/Transaction');

async function index(req, res){
    try {
        return transactionService.index(req.user.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
};

module.exports = {
    index,
};