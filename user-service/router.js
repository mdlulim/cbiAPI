const accountController = require('./controllers/Account');
const addressController = require('./controllers/Address');
const bankAccountController = require('./controllers/BankAccount');
const beneficiaryController = require('./controllers/Beneficiary');
const commissionController = require('./controllers/Commission');
const cryptoAccountController = require('./controllers/CryptoAccount');
const documentController = require('./controllers/Document');
const emailAddressController = require('./controllers/EmailAddress');
const mobileNumberController = require('./controllers/MobileNumber');
const notificationController = require('./controllers/Notification');
const statisticsController   = require('./controllers/Statistics');
const userController = require('./controllers/User');
const authMiddleware = require('./middlewares/auth');

module.exports.set = app => {
    app.get('/statistics', authMiddleware.checkAuth, statisticsController.index);

    app.post('/autorenew', authMiddleware.checkAuth, userController.autorenew);

    app.get('/profile', authMiddleware.checkAuth, userController.profile);
    app.get('/referrals', authMiddleware.checkAuth, userController.referrals);
    app.put('/profile', authMiddleware.checkAuth, userController.update);

    app.get('/activities', authMiddleware.checkAuth, userController.activities);

    app.get('/devices', authMiddleware.checkAuth, userController.devices);

    app.get('/commissions/:type/total', authMiddleware.checkAuth, commissionController.total);

    app.get('/referrals/:uid', authMiddleware.checkAuth, userController.referralsByUUID);

    app.get('/coaches', authMiddleware.checkAuth, userController.coaches);

    app.post('/addresses', authMiddleware.checkAuth, addressController.create);
    app.get('/addresses', authMiddleware.checkAuth, addressController.index);
    app.get('/addresses/:id', authMiddleware.checkAuth, addressController.show);
    app.put('/addresses/:id', authMiddleware.checkAuth, addressController.update);
    app.delete('/addresses/:id', authMiddleware.checkAuth, addressController.destroy);

    app.post('/bank_accounts', authMiddleware.checkAuth, bankAccountController.create);
    app.get('/bank_accounts', authMiddleware.checkAuth, bankAccountController.index);
    app.get('/bank_accounts/:id', authMiddleware.checkAuth, bankAccountController.show);
    app.put('/bank_accounts/:id', authMiddleware.checkAuth, bankAccountController.update);
    app.delete('/bank_accounts/:id', authMiddleware.checkAuth, bankAccountController.destroy);

    app.post('/beneficiaries', authMiddleware.checkAuth, beneficiaryController.create);
    app.get('/beneficiaries', authMiddleware.checkAuth, beneficiaryController.index);
    app.put('/beneficiaries/:id', authMiddleware.checkAuth, beneficiaryController.update);
    app.delete('/beneficiaries/:id', authMiddleware.checkAuth, beneficiaryController.destroy);

    app.post('/crypto_accounts', authMiddleware.checkAuth, cryptoAccountController.create);
    app.get('/crypto_accounts', authMiddleware.checkAuth, cryptoAccountController.index);
    app.get('/crypto_accounts/:id', authMiddleware.checkAuth, cryptoAccountController.show);
    app.put('/crypto_accounts/:id', authMiddleware.checkAuth, cryptoAccountController.update);
    app.delete('/crypto_accounts/:id', authMiddleware.checkAuth, cryptoAccountController.destroy);

    app.post('/documents', authMiddleware.checkAuth, documentController.create);
    app.get('/documents', authMiddleware.checkAuth, documentController.index);
    app.get('/documents/:id', authMiddleware.checkAuth, documentController.show);
    app.put('/documents/:id', authMiddleware.checkAuth, documentController.update);
    app.delete('/documents/:id', authMiddleware.checkAuth, documentController.destroy);

    app.post('/email_addresses', authMiddleware.checkAuth, emailAddressController.create);
    app.get('/email_addresses', authMiddleware.checkAuth, emailAddressController.index);
    app.get('/email_addresses/:id', authMiddleware.checkAuth, emailAddressController.show);
    app.put('/email_addresses/:id', authMiddleware.checkAuth, emailAddressController.update);
    app.delete('/email_addresses/:id', authMiddleware.checkAuth, emailAddressController.destroy);

    app.post('/mobile_numbers', authMiddleware.checkAuth, mobileNumberController.create);
    app.get('/mobile_numbers', authMiddleware.checkAuth, mobileNumberController.index);
    app.get('/mobile_numbers/:id', authMiddleware.checkAuth, mobileNumberController.show);
    app.put('/mobile_numbers/:id', authMiddleware.checkAuth, mobileNumberController.update);
    app.delete('/mobile_numbers/:id', authMiddleware.checkAuth, mobileNumberController.destroy);

    app.get('/notifications', authMiddleware.checkAuth, notificationController.index);
    app.put('/notifications/:id', authMiddleware.checkAuth, notificationController.update);
    app.delete('/notifications/:id', authMiddleware.checkAuth, notificationController.destroy);

    app.get('/wallet', authMiddleware.checkAuth, accountController.wallet);

    app.get('/kyc', authMiddleware.checkAuth, userController.kyc);
    app.post('/kyc', authMiddleware.checkAuth, userController.captureKYC);

    app.get('/kyc-level', authMiddleware.checkAuth, userController.kyc_level);

    app.get('/search/:prop/:value', authMiddleware.checkAuth, userController.search);
};
