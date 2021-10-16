const userController = require('./controllers/user');
const authMiddleware = require('./middlewares/auth');

module.exports.set = app => {
    app.get('/profile', authMiddleware.checkAuth, userController.profile);
};
