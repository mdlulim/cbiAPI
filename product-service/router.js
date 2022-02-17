const authMiddleware    = require('./middlewares/auth');
const productController = require('./controllers/Product');
const wealthCreatorController = require('./controllers/WealthCreator');

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
     * Retrieve Product Categories
     * 
     * Retrieve product categories.
     */
    app.get('/categories', authMiddleware.checkAuth, productController.categories);
    
    /**
     * Retrieve Product Categories
     * 
     * Retrieve product categories.
     */
    app.post('/wealth-creator/qualify', authMiddleware.checkAuth, wealthCreatorController.qualify);
    
    /**
     * Retrieve Single Product Category
     * 
     * Retrieve current user’s product details.
     */
    app.get('/categories/:permakey', authMiddleware.checkAuth, productController.category);
    
    /**
     * Retrieve Sub Categories
     * 
     * Retrieve product subcategories by category.
     */
    app.get('/subcategories', authMiddleware.checkAuth, productController.subcategories);
    
    /**
     * Retrieve Sub Categories
     * 
     * Retrieve product subcategories by category.
     */
    app.get('/subcategories/:permakey', authMiddleware.checkAuth, productController.subcategory);
    
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
     * Retrieve Single Product's Earnings
     * 
     * Retrieve current user’s product earnings.
     */
    app.get('/:permakey/earnings', authMiddleware.checkAuth, productController.earnings);
    
    /**
     * Retrieve Single Product
     * 
     * Retrieve current user’s product details.
     */
    app.get('/:permakey/transactions', authMiddleware.checkAuth, productController.transactions);
    
    /**
     * Subscribe
     * 
     * Subscribe a User to a Product
     */
    app.post('/subscribe', authMiddleware.checkAuth, productController.subscribe);
    
    /**
     * Unsubscribe
     * 
     * Unsubscribe a User from a Product
     */
    app.post('/unsubscribe', authMiddleware.checkAuth, productController.unsubscribe);
    
    /**
     * Invest
     * 
     * Invest to a Product
     */
    app.post('/invest', authMiddleware.checkAuth, productController.invest);
    
    /**
     * Cancel product
     * 
     * Cancel/suspend a User Product
     */
    app.delete('/cancel/:id', authMiddleware.checkAuth, productController.cancel);
};
