const authMiddleware = require('./middlewares/auth');
const feeController = require('./controllers/Fee');
const transactionController = require('./controllers/Transaction');

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
    app.get('/',  transactionController.index);
    
    /**
     * Retrieve User's Transactions Stats
     * 
     * Retrieve current user’s transactions stats.
     */
    app.get('/count/:tx_type/:subtype', authMiddleware.checkAuth, transactionController.count);
    
    /**
     * Retrieve User's Transactions Totals
     * 
     * Retrieve current user’s transactions totals.
     */
    app.get('/totals/:tx_type/:subtype', authMiddleware.checkAuth, transactionController.totals);
    
    /**
     * Retrieve Transaction Fees
     * 
     * Retrieve transaction fees by type.
     */
    app.get('/fees/:tx_type/:subtype', authMiddleware.checkAuth, feeController.show);

    app.get('/transactions', authMiddleware.checkAuth, transactionController.allTransactions);

};
