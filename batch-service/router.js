const userController = require('./controllers/User');
const authMiddleware = require('./middlewares/auth');


module.exports.set = app => {
    /**
     * Process Deposits batch file
     * 
     * Updates user records on db with data from batch file
     */
    app.post('/process', userController.process);

    /**
     * Process Withdrawals batch file
     * 
     * Updates user records on db with data from batch file
     */
    app.post('/status', authMiddleware.checkAuth, userController.status);

    /**
     * This sets transactions included in csv file to stautus 'In Progress' 
     * 
     * Updates user records on db with data from batch file
     */
     app.post('/set-status', authMiddleware.checkAuth, userController.updateTransaction);


};
