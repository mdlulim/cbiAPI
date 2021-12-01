const authMiddleware = require('./middlewares/auth');
const cronController = require('./controllers/Cron');

module.exports.set = app => {
    app.get('/', cronController.index);
    
    app.post('/wc-autorenew', cronController.autorenew);
};
