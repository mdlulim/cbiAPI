const authMiddleware    = require('./middlewares/auth');
const productController = require('./controllers/Product');

module.exports.set = app => {
    /**
     * Retrieve User's Products
     * 
     * Retrieve current user’s products.
     */
    app.get('/products', authMiddleware.checkAuth, productController.index);
};
