const buddyAccountController = require('./controllers/BuddyAccountController');


module.exports.set = app => {

    app.get('/lookupaccount', async (req, res) => { 
        res.send('response');
    });

    app.get('/lookupbalance', buddyAccountController.lookupbalance );
    
    app.get('/lookuptransactions', async (req, res) => {
        const response = await buddyService.lookupTransactions
        res.send(response);
    });

    app.get('/eventtransfer', async (req, res) => {
        const response = await buddyService.eventTransfer 
        res.send(response);
    });

}