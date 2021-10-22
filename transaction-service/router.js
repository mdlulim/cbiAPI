const authMiddleware    = require('./middlewares/auth');
const transactionController = require('./controllers/Transaction');

module.exports.set = app => {
    
    /**
     * Retrieve User's Transactions
     * 
     * Retrieve current user’s transactions.
     */
    app.get('/', authMiddleware.checkAuth, transactionController.index);
};
