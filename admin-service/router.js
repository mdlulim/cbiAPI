const currencyController = require('./controllers/Currency');
const groupController = require('./controllers/Group');
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
    app.post('/admin/users', authMiddleware.checkAuth, userController.create);

    /**
     * List Users
     * 
     * Get a list of users belonging to CBI.
     */
    app.get('/admin/users', authMiddleware.checkAuth, userController.index);

    /**
     * Retrieve User
     * 
     * Retrieve a company’s user (profile).
     */
    app.get('/admin/users/:id', authMiddleware.checkAuth, userController.show);

    /**
     * Update User
     * 
     * Update user details.
     */
    app.put('/admin/users/:id', authMiddleware.checkAuth, userController.update);

    /**
     * Archive User
     * 
     * Archived company's user.
     */
    app.put('/admin/users/:id/archive', authMiddleware.checkAuth, userController.archive);

    /**
     * Block User
     * 
     * Block company's user.
     */
    app.put('/admin/users/:id/block', authMiddleware.checkAuth, userController.block);

    /**
     * Retrieve User' Referrals
     * 
     * Retrieve a company’s user referrals.
     */
    app.get('/admin/users/:id/referrals', authMiddleware.checkAuth, userController.referrals);

    /**
     * Retrieve User' Products
     * 
     * Retrieve a company’s user products.
     */
    app.get('/admin/users/:id/products', authMiddleware.checkAuth, userController.products);

    /**
     * Retrieve User' Transactions
     * 
     * Retrieve a company’s user transactions.
     */
    app.get('/admin/users/:id/transactions', authMiddleware.checkAuth, userController.transactions);

    /**
     * List User Products
     * 
     * Get a list of products belonging to CBI's user.
     */
    // app.get('/admin/users/:id/products', authMiddleware.checkAuth, userController.products);

    /**
     * Groups
     * 
     * CBI inclused a group management system, that
     * allows admin users to create groups as well
     * as individually manage users’ permissions to
     * view, add, edit or delete data from the system
     * via admin endpoints.
     */
    app.post('/admin/groups', authMiddleware.checkAuth, groupController.create);
    app.get('/admin/groups', authMiddleware.checkAuth, groupController.index);
    app.get('/admin/groups/:id', authMiddleware.checkAuth, groupController.show);
    app.put('/admin/groups/:id', authMiddleware.checkAuth, groupController.update);
    app.delete('/admin/groups/:id', authMiddleware.checkAuth, groupController.destroy);

    /**
     * Create Product
     * 
     * Create a single product belonging to CBI.
     */
    app.post('/admin/products', authMiddleware.checkAuth, productController.create);

    /**
     * List Products
     * 
     * Get a list of products belonging to CBI.
     */
    app.get('/admin/products', authMiddleware.checkAuth, productController.index);

    /**
     * Retrieve Product
     * 
     * Retrieve a company’s product.
     */
    app.get('/admin/products/:id', authMiddleware.checkAuth, productController.show);

    /**
     * Update Product
     * 
     * Update company’s product details.
     */
    app.put('/admin/products/:id', authMiddleware.checkAuth, productController.update);

    /**
     * Delete Product
     * 
     * Delete company’s product.
     */
    app.delete('/admin/products/:id', authMiddleware.checkAuth, productController.destroy);

    /**
     * List Transactions
     * 
     * Get a list of transactions belonging to CBI.
     */
    app.get('/admin/transactions', authMiddleware.checkAuth, transactionController.index);

    /**
     * Retrieve Transaction
     * 
     * Retrieve a company’s transaction.
     */
    app.get('/admin/transactions/:id', authMiddleware.checkAuth, transactionController.show);

    /**
     * List Currencies
     * 
     * Get a list of currencies belonging to CBI.
     */
    app.get('/admin/currencies', authMiddleware.checkAuth, currencyController.index);

    /**
     * Retrieve Currency
     * 
     * Retrieve a company’s currency.
     */
    app.get('/admin/currencies/:code', authMiddleware.checkAuth, currencyController.show);

    /**
     * Update Currency
     * 
     * Update company’s currency details.
     */
    app.put('/admin/currencies/:code', authMiddleware.checkAuth, currencyController.update);

    /**
     * Delete Currency
     * 
     * Delete company’s currency.
     */
    app.delete('/admin/currencies/:code', authMiddleware.checkAuth, currencyController.destroy);
};
