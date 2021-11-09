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
    
    /**
     * Retrieve Single Product
     * 
     * Retrieve current user’s product details.
     */
    app.get('/categories', authMiddleware.checkAuth, productController.categories);
    
    /**
     * Retrieve Single Product
     * 
     * Retrieve current user’s product details.
     */
    app.get('/category/:id/products', authMiddleware.checkAuth, productController.products);
    
    /**
     * Retrieve Single Product
     * 
     * Retrieve current user’s product details.
     */
    app.get('/:permakey', authMiddleware.checkAuth, productController.show);
    
    /**
     * Subscribe
     * 
     * Subscribe a User to a Product
     */
    app.post('/subscribe', authMiddleware.checkAuth, productController.subscribe);
    
    /**
     * Invest
     * 
     * Invest to a Product
     */
    app.post('/invest', authMiddleware.checkAuth, productController.invest);
};
