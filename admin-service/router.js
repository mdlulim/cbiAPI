const groupController = require('./controllers/Group');
const productController = require('./controllers/Product');
const userController = require('./controllers/User');
const kycController = require('./controllers/KYC');
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
     * Retrieve a company’s user.
     */
    app.get('/admin/users/:id', authMiddleware.checkAuth, userController.show);

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
     * Retrieve Product
     * 
     * Retrieve a company’s product.
     */
    // app.get('/admin/products/search/:prop/:value', authMiddleware.checkAuth, productController.search);
    app.get('/admin/users/:id/kyc', kycController.show);

};
