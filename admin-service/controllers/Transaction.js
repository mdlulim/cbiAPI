const transactionService = require('../services/Transaction');

async function index(req, res) {
    try {
        const transactions = await transactionService.index(req.query);
        const { count, rows } = transactions;
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
        const transaction = await transactionService.show(req.params.id);
        return res.send({
            success: true,
            data: transaction
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}
async function getProofOfPayment(req, res) {
    try {
        const files = await transactionService.getProofOfPayment(req.params.id);
        console.log(files)
        return res.send({
            success: true,
            data: files
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function allTransactions(req, res){
    try {
        return transactionService.allTransactions()
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
    show,
    allTransactions,
    getProofOfPayment,
};