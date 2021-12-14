const buddyAccountController = require('./controllers/BuddyAccountController');


module.exports.set = app => {

    app.get('/account', buddyAccountController.lookupaccount);

    app.get('/balance', buddyAccountController.lookupbalance );
    
    app.get('/transactions', buddyAccountController.lookuptransactions);

    app.get('/eventtransfer', buddyAccountController.eventtransfer);

}