const accountController = require('./controllers/Account');
const countryController = require('./controllers/Country');
const currencyController = require('./controllers/Currency');
const groupController = require('./controllers/Group');
const kycController = require('./controllers/KYC');
const productController = require('./controllers/Product');
const transactionController = require('./controllers/Transaction');
const userController = require('./controllers/User');
const authMiddleware = require('./middlewares/auth');

module.exports.set = app => {
    /**
     * Create User
     * 
     * Create a user.
     */
    app.post('/users', authMiddleware.checkAuth, userController.create);

    /**
     * List Users
     * 
     * Get a list of users belonging to CBI.
     */
    app.get('/users', authMiddleware.checkAuth, userController.index);

    /**
     * Retrieve User
     * 
     * Retrieve a company’s user (profile).
     */
    app.get('/users/:id', authMiddleware.checkAuth, userController.show);

    /**
     * Update User
     * 
     * Update user details.
     */
    app.put('/users/:id', authMiddleware.checkAuth, userController.update);

    /**
     * Retrieve User Addresses
     * 
     * Retrieve user addresses.
     */
    app.get('/users/:id/addresses', authMiddleware.checkAuth, userController.addresses);

    /**
     * Retrieve User Emails
     * 
     * Retrieve user email addresses.
     */
    app.get('/users/:id/emails', authMiddleware.checkAuth, userController.emails);

    /**
     * Retrieve User Mobiles
     * 
     * Retrieve user mobile addresses.
     */
    app.get('/users/:id/mobiles', authMiddleware.checkAuth, userController.mobiles);

    /**
     * Retrieve User Banks
     * 
     * Retrieve user bank accounts.
     */
    app.get('/users/:id/bank_accounts', authMiddleware.checkAuth, userController.bankAccounts);

    /**
     * Retrieve User Crypto Accounts
     * 
     * Retrieve user crypto accounts.
     */
    app.get('/users/:id/crypto_accounts', authMiddleware.checkAuth, userController.cryptoAccounts);

    /**
     * Archive User
     * 
     * Archived company's user.
     */
    app.put('/users/:id/archive', authMiddleware.checkAuth, userController.archive);

    /**
     * Block User
     * 
     * Block company's user.
     */
    app.put('/users/:id/block', authMiddleware.checkAuth, userController.block);

    /**
     * Archive User
     * 
     * Archived company's user.
     */
    app.put('/users/:id/unarchive', authMiddleware.checkAuth, userController.unarchive);

    /**
     * Block User
     * 
     * Block company's user.
     */
    app.put('/users/:id/unblock', authMiddleware.checkAuth, userController.unblock);

    /**
     * Retrieve User' Referrals
     * 
     * Retrieve a company’s user referrals.
     */
    app.get('/users/:id/referrals', authMiddleware.checkAuth, userController.referrals);

    /**
     * Retrieve User' Products
     * 
     * Retrieve a company’s user products.
     */
    app.get('/users/:id/products', authMiddleware.checkAuth, userController.products);

    /**
     * Retrieve User' Transactions
     * 
     * Retrieve a company’s user transactions.
     */
    app.get('/users/:id/transactions', authMiddleware.checkAuth, userController.transactions);

    /**
     * Retrieve User' Transactions
     * 
     * Retrieve a company’s user transactions.
     */
    app.put('/users/:id/transactions', authMiddleware.checkAuth, userController.updateTransaction);

    /**
     * Retrieve User's CBI Account/Wallet
     * 
     * Retrieve a company’s user account/wallet.
     */
    app.get('/users/:id/wallet', authMiddleware.checkAuth, accountController.wallet);

    /**
     * Retrieve User's KYC
     * 
     * Retrieve a company’s user kyc.
     */
    app.get('/admin/users/:id/kyc', authMiddleware.checkAuth, kycController.show);

    /**
     * List User Products
     * 
     * Get a list of products belonging to CBI's user.
     */
    // app.get('/users/:id/products', authMiddleware.checkAuth, userController.products);

    /**
     * Groups
     * 
     * CBI inclused a group management system, that
     * allows admin users to create groups as well
     * as individually manage users’ permissions to
     * view, add, edit or delete data from the system
     * via admin endpoints.
     */
    app.post('/groups', authMiddleware.checkAuth, groupController.create);
    app.get('/groups', authMiddleware.checkAuth, groupController.index);
    app.get('/groups/:id', authMiddleware.checkAuth, groupController.show);
    app.put('/groups/:id', authMiddleware.checkAuth, groupController.update);
    app.delete('/groups/:id', authMiddleware.checkAuth, groupController.destroy);

    /**
     * Create Product Category
     * 
     * Create a product category belonging to CBI.
     */
    app.post('/products/categories', authMiddleware.checkAuth, productController.createCategory);

    /**
     * List Product Categories
     * 
     * Get a list of products belonging to CBI.
     */
    app.get('/products/categories', authMiddleware.checkAuth, productController.categories);

    /**
     * Create Product
     * 
     * Create a single product belonging to CBI.
     */
    app.post('/products', authMiddleware.checkAuth, productController.create);

    /**
     * List Products
     * 
     * Get a list of products belonging to CBI.
     */
    app.get('/products', authMiddleware.checkAuth, productController.index);

    /**
     * Retrieve Product
     * 
     * Retrieve a company’s product.
     */
    app.get('/products/:id', authMiddleware.checkAuth, productController.show);

    /**
     * Update Product
     * 
     * Update company’s product details.
     */
    app.put('/products/:id', authMiddleware.checkAuth, productController.update);

    /**
     * Delete Product
     * 
     * Delete company’s product.
     */
    app.delete('/products/:id', authMiddleware.checkAuth, productController.destroy);

    /**
     * List Transactions
     * 
     * Get a list of transactions belonging to CBI.
     */
    app.get('/transactions', authMiddleware.checkAuth, transactionController.index);

    /**
     * Retrieve Transaction
     * 
     * Retrieve a company’s transaction.
     */
    app.get('/transactions/:id', authMiddleware.checkAuth, transactionController.show);

    /**
     * List Currencies
     * 
     * Get a list of currencies belonging to CBI.
     */
    app.get('/currencies', authMiddleware.checkAuth, currencyController.index);

    /**
     * Retrieve Currency
     * 
     * Retrieve a company’s currency.
     */
    app.get('/currencies/:code', authMiddleware.checkAuth, currencyController.show);

    /**
     * Update Currency
     * 
     * Update company’s currency details.
     */
    app.put('/currencies/:code', authMiddleware.checkAuth, currencyController.update);

    /**
     * Delete Currency
     * 
     * Delete company’s currency.
     */
    app.delete('/currencies/:code', authMiddleware.checkAuth, currencyController.destroy);

    /**
     * List Countries
     * 
     * Get a list of countries belonging to CBI.
     */
    app.get('/countries', authMiddleware.checkAuth, countryController.index);
    app.put('/countries/:id/blacklist', authMiddleware.checkAuth, countryController.blacklist);
    app.put('/countries/:id/unblacklist', authMiddleware.checkAuth, countryController.unblacklist);
};
