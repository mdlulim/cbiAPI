const authMiddleware = require('./middlewares/auth');
const feeController = require('./controllers/Fee');
const transactionController = require('./controllers/Transaction');
const buddyAPIController = require('./controllers/BuddyAPIController');
const buddyAccountController = require('./controllers/BuddyAccountController');

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
    
    /**
     * Retrieve Transaction Fees
     * 
     * Retrieve transaction fees by type.
     */
    app.get('/fees/:tx_type/:subtype', authMiddleware.checkAuth, feeController.fees);


    // buddyAPI Routes
    app.get("/buddy/lookup-balance", authMiddleware.checkAuth, buddyAPIController.lookupBalance);
    app.get("/buddy/lookup-account", authMiddleware.checkAuth, buddyAPIController.lookupAccount);
    app.get("/buddy/lookup-transactions", authMiddleware.checkAuth, buddyAPIController.lookupTransaction);
    app.post("/buddy/eventtransfer", authMiddleware.checkAuth, buddyAPIController.eventTransfer);

    // buddyAccount Routes
    app.get("/buddy", authMiddleware.checkAuth, buddyAccountController.index);
    app.post("/buddy", authMiddleware.checkAuth, buddyAccountController.store);
    app.get("/buddy/:buddyId", authMiddleware.checkAuth, buddyAccountController.show);
    app.put("/buddy/:buddyId", authMiddleware.checkAuth, buddyAccountController.updateBuddy);
    app.delete("/buddy/:buddyId", authMiddleware.checkAuth, buddyAccountController.destroy);

};
