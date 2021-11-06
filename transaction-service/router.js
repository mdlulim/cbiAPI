const authMiddleware = require('./middlewares/auth');
const transactionController = require('./controllers/Transaction');
const axios = require('axios');

module.exports.set = app => {
    
    /**
     * Create Transaction
     * 
     * Create transaction for current user
     */
    app.post('/', authMiddleware.checkAuth, transactionController.create);
    
    /**
     * Retrieve User's Transactions
     * 
     * Retrieve current user’s transactions.
     */
    app.get('/', authMiddleware.checkAuth, transactionController.index);

    app.get("/buddy/lookup-balance", async (req, res) => {
        try {
            const response = await axios('https://staging.buddy.na/api/v2/services/cbi/lookup/balance', {
                headers:{
                    'authenticationToken': 'NmIwNWUwNmEtY2RjYi00MWRkLThlMDEtOGRjZjU1MWU3MjZk'
                }
            });
            res.send(response.data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    });

    app.get("/buddy/lookup-account", async (req, res) => {
        try {
            const identifier = req.body.identifier
            const response = await axios('https://staging.buddy.na/api/v2/services/cbi/lookup/account', {
                params: { identifier },
                headers:{
                    'authenticationToken': 'NmIwNWUwNmEtY2RjYi00MWRkLThlMDEtOGRjZjU1MWU3MjZk'
                }
            });
            res.send(response.data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    });

    app.get("/buddy/lookup-transactions", async (req, res) => {
        try {
            const search = req.body.search;
            const from = req.body.from;
            const to = req.body.to;
            const perPage = req.body.perPage;
            const page = req.body.page;
            const response = await axios('https://staging.buddy.na/api/v2/services/cbi/lookup/transactions', {
                params: { search, from, to, perPage, page },
                headers:{
                    'authenticationToken': 'NmIwNWUwNmEtY2RjYi00MWRkLThlMDEtOGRjZjU1MWU3MjZk'
                }
            });
            res.send(response.data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    });

    app.post("/buddy/eventtransfer", async (req, res) => {
        try {
            const response = await axios('https://staging.buddy.na/api/v2/services/cbi/lookup/balance', {
                data: {
                    reference: req.body.reference,
                    identifier: req.body.identifier,
                    amount: req.body.amount,
                    currency: req.body.currency
                },
                headers: {
                    'authenticationToken': 'NmIwNWUwNmEtY2RjYi00MWRkLThlMDEtOGRjZjU1MWU3MjZk'
                }
            });
            res.send(response.data);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    });
};
