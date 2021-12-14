const documentController = require('./controllers/Document');
const authMiddleware = require('./middlewares/auth');

module.exports.set = app => {
    // app.get('/', authMiddleware.checkAuth, documentController.index);
    app.post('/upload/:category/:type', authMiddleware.checkAuth, documentController.upload);
    app.post('/batch-upload/:category/:type', authMiddleware.checkAuth, documentController.batch_upload);
    app.get('/batch-get', authMiddleware.checkAuth, documentController.batch_show);

    app.get('/file', authMiddleware.checkAuth, documentController.show);
};
