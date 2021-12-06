const authMiddleware = require('./middlewares/auth');
const cronController = require('./controllers/Cron');

module.exports.set = app => {
    app.get('/', cronController.index);
    
    app.get('/wc-autorenew', cronController.autorenew);
    
    app.get('/wc-autorenew/notify', cronController.autorenewNotify);
    
    app.get('/wc-autorenew/notify', cronController.autorenewNotify);
    
    app.get('/products/:code/commission', cronController.productCommission);
};
