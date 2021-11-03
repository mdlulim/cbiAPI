const transactionService    = require('../services/Transaction');

async function create(req, res) {
    try {
        const data = {
            ...req.body,
            user_id: req.user.id
        };
        return transactionService.create(data)
        .then(data => res.send(data));
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

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
    create,
    index,
};