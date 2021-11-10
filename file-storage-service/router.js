const documentController = require('./controllers/Document');
const authMiddleware = require('./middlewares/auth');

module.exports.set = app => {
    app.get('/', authMiddleware.checkAuth, documentController.index);
    app.post('/upload', authMiddleware.checkAuth, documentController.upload);
};
