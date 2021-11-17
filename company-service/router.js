const authMiddleware    = require('./middlewares/auth');
const companyController = require('./controllers/Company');
const countryController = require('./controllers/Country');
const settingController = require('./controllers/Setting');

module.exports.set = app => {
    /**
     * Retrieve Company Details
     * 
     * Retrieve current user’s company details.
     */
    app.get('/', authMiddleware.checkAuth, companyController.profile);

    /**
     * List Company Currencies
     * 
     * Get a list of available currencies for the 
     * current user’s company.
     */
    app.get('/currencies', authMiddleware.checkAuth, companyController.currencies);

    /**
     * List Company Banks
     * 
     * Get a list of company banks for the current
     * user’s company.
     */
    app.get('/bank-accounts', authMiddleware.checkAuth, companyController.bankAccounts);

    /**
     * List Company Crypto Accounts
     * 
     * Get a list of company crypto accounts for the current
     * user’s company.
     */
    app.get('/crypto-accounts', authMiddleware.checkAuth, companyController.cryptoAccounts);

    /**
     * Retrieve Company Settings
     * 
     * Retrieve company settings for the current
     * user’s company.
     */
    app.get('/settings', authMiddleware.checkAuth, settingController.index);

    /**
     * Retrieve Countries
     * 
     */
    app.get('/countries', authMiddleware.checkAuth, countryController.index);
};
