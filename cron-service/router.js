const authMiddleware = require('./middlewares/auth');
const cronController = require('./controllers/Cron');

module.exports.set = app => {
    app.get('/', cronController.index);
    
    app.get('/wc-stars', cronController.stars);
    
    app.get('/wc-autorenew', cronController.autorenew);
    
    app.get('/wc-autorenew/notify', cronController.autorenewNotify);
    
    app.get('/products/:permakey/daily/earnings', cronController.productDailyEarnings);
    
    app.get('/products/:permakey/weekly/earnings', cronController.productWeeklyEarnings);
};
