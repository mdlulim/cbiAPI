const authMiddleware = require('./middlewares/auth');
const transactionController = require('./controllers/Transaction');
const buddyAPIController = require('./controllers/BuddyAPIController');

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


    // buddyAPI Routes
    app.get("/buddy/lookup-balance", authMiddleware.checkAuth, buddyAPIController.lookupBalance);
    app.get("/buddy/lookup-account", authMiddleware.checkAuth, buddyAPIController.lookupAccount);
    app.get("/buddy/lookup-transactions", authMiddleware.checkAuth, buddyAPIController.lookupTransaction);
    app.post("/buddy/eventtransfer", authMiddleware.checkAuth, buddyAPIController.eventTransfer);
};
