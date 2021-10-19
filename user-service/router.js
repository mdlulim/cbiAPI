const userController = require('./controllers/User');
const authMiddleware = require('./middlewares/auth');

module.exports.set = app => {
    app.get('/profile', authMiddleware.checkAuth, userController.profile);
    app.get('/referrals', authMiddleware.checkAuth, userController.referrals);
};
