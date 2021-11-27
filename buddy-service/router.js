const buddyController = require('./controllers/BuddyController');

module.exports.set = app => {
    
    app.get('/',  buddyController.lookupaccount);
};
