const authMiddleware = require('./middlewares/auth');
const feeController = require('./controllers/Fee');
const coinPaymentController = require('./controllers/CoinPayment');
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
     app.get('/', authMiddleware.checkAuth, transactionController.index);
    
    /**
     * Retrieve User's Transactions
     * 
     * Retrieve current user’s transactions.
     */
    app.get('/buddy', authMiddleware.checkAuth, transactionController.buddy);
    
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
    
    /**
     * Retrieve Transaction Limits
     * 
     * Retrieve transaction limits by kyc level.
     */
    app.get('/limits/:kyc_level', authMiddleware.checkAuth, transactionController.limits);

    
    /**
     * Handle btc deposits
     */
     app.post('/coinpayments/ipn', coinPaymentController.ipn);

    /**
     * Create crypto transaction
     * 
     * Send query to create crypto transaction on coinpayments.
     */
      app.post('/coinpayments/create', authMiddleware.checkAuth, coinPaymentController.create);

    /**
     * Create crypto transaction
     * 
     * Send query to create crypto transaction on coinpayments.
     */
    app.post('/coinpayments/convert', authMiddleware.checkAuth, coinPaymentController.convert);

    /**
     * GET Coin Balances
     * 
     * Send query to create crypto transaction on coinpayments.
     */
    app.get('/coinpayments/balances', authMiddleware.checkAuth, coinPaymentController.balances);

};
