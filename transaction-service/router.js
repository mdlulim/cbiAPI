const authMiddleware = require('./middlewares/auth');
const transactionController = require('./controllers/Transaction');
const buddyAPIController = require('./controllers/BuddyAPIController');
const axios = require('axios');
const { lookupBalance } = require('./services/BuddyAPI');

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

    app.get("/buddy/lookup-balance", buddyAPIController.lookupBalance);

    app.get("/buddy/lookup-account", buddyAPIController.lookupAccount);

    app.get("/buddy/lookup-transactions", buddyAPIController.lookupTransaction);

    app.post("/buddy/eventtransfer", buddyAPIController.eventTransfer);
};
