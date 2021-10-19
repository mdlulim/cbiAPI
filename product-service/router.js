const authMiddleware    = require('./middlewares/auth');
const productController = require('./controllers/Product');

module.exports.set = app => {
    /**
     * Retrieve User's Products
     * 
     * Retrieve current user’s products.
     */
    app.get('/overview', authMiddleware.checkAuth, productController.overview);
    
    /**
     * Retrieve User's Products
     * 
     * Retrieve current user’s products.
     */
    app.get('/', authMiddleware.checkAuth, productController.index);
};
