const accountController = require('./controllers/Account');
const countryController = require('./controllers/Country');
const currencyController = require('./controllers/Currency');
const groupController = require('./controllers/Group');
const kycController = require('./controllers/KYC');
const productController = require('./controllers/Product');
const permissionLevelController = require('./controllers/PermissionLevel');
const transactionController = require('./controllers/Transaction');
const userController = require('./controllers/User');
const buddyAPIController = require('./controllers/BuddyAPIController');
const buddyAccountController = require('./controllers/BuddyAccountController');
const pagePermissionController = require('./controllers/PagePermission');
const feeController = require('./controllers/Fee');
const settingController = require('./controllers/Setting');
const authMiddleware = require('./middlewares/auth');
const companyController = require('./controllers/Company');
const bankAccountController = require('./controllers/BankAccount');


module.exports.set = app => {
    /**
     * Create User
     * 
     * Create a user.
     */
    app.post('/users', authMiddleware.checkAuth, userController.create);

    /**
     * List Users
     * 
     * Get a list of users belonging to CBI.
     */
    app.get('/users', authMiddleware.checkAuth, userController.index);

    /**
     * Retrieve User
     * 
     * Retrieve a company’s user (profile).
     */
    app.get('/users/:id', authMiddleware.checkAuth, userController.show);

    /**
     * Update User
     * 
     * Update user details.
     */
    app.put('/users/:id', authMiddleware.checkAuth, userController.update);

    /**
     * Retrieve User Addresses
     * 
     * Retrieve user addresses.
     */
    app.get('/users/:id/addresses', authMiddleware.checkAuth, userController.addresses);

    /**
     * Retrieve User Emails
     * 
     * Retrieve user email addresses.
     */
    app.get('/users/:id/emails', authMiddleware.checkAuth, userController.emails);

    app.get('/users/email/:email', authMiddleware.checkAuth, userController.email);
    

    /**
     * Retrieve User Mobiles
     * 
     * Retrieve user mobile addresses.
     */
    app.get('/users/:id/mobiles', authMiddleware.checkAuth, userController.mobiles);

    /**
     * Retrieve User Banks
     * 
     * Retrieve user bank accounts.
     */
    app.get('/users/:id/bank_accounts', authMiddleware.checkAuth, userController.bankAccounts);

    /**
   * Update user bank accounts.
   */
    app.put('/bank_accounts/:id', authMiddleware.checkAuth, userController.updateBankAccounts);

    /**
     * Retrieve User Crypto Accounts
     * 
     * Retrieve user crypto accounts.
     */
    app.get('/users/:id/crypto_accounts', authMiddleware.checkAuth, userController.cryptoAccounts);

    /**
     * Archive User
     * 
     * Archived company's user.
     */
    app.put('/users/:id/archive', authMiddleware.checkAuth, userController.archive);

    /**
     * Block User
     * 
     * Block company's user.
     */
    app.put('/users/:id/block', authMiddleware.checkAuth, userController.block);

    /**
     * Archive User
     * 
     * Archived company's user.
     */
    app.put('/users/:id/unarchive', authMiddleware.checkAuth, userController.unarchive);

    /**
     * Block User
     * 
     * Block company's user.
     */
    app.put('/users/:id/unblock', authMiddleware.checkAuth, userController.unblock);

    /**
     * Retrieve User' Referrals
     * 
     * Retrieve a company’s user referrals.
     */
    app.get('/users/:id/referrals', authMiddleware.checkAuth, userController.referrals);

    /**
     * Retrieve User' Products
     * 
     * Retrieve a company’s user products.
     */
    app.get('/users/:id/products', authMiddleware.checkAuth, userController.products);

    /**
     * Retrieve User' Transactions
     * 
     * Retrieve a company’s user transactions.
     */
    app.get('/users/:id/transactions', authMiddleware.checkAuth, userController.transactions);

    /**
     * Retrieve User' Transactions
     * 
     * Retrieve a company’s user transactions.
     */
    app.put('/users/:id/transactions', authMiddleware.checkAuth, userController.updateTransaction);

    /**
     * Retrieve User' Transactions
     * 
     * Retrieve a company’s user transactions.
     */
    app.put('/users/:id/transactions/deposit', authMiddleware.checkAuth, userController.approveDeposit);

    /**
     * Retrieve User' Transactions
     * 
     * Retrieve a company’s user transaction credit.
     */
    app.post('/users/:id/transactions/credit', authMiddleware.checkAuth, transactionController.debitCreditUserAccount);

    /**
     * Retrieve User's CBI Account/Wallet
     * 
     * Retrieve a company’s user account/wallet.
     */
    app.get('/users/:id/wallet', authMiddleware.checkAuth, accountController.wallet);

    /**
     * Capture User's KYC Record
     * 
     * Capture a company’s user kyc.
     */
    app.post('/users/:id/kyc', authMiddleware.checkAuth, kycController.create);

    /**
     * Retrieve User's KYC
     * 
     * Retrieve a company’s user kyc.
     */
    app.get('/users/:id/kyc', kycController.show);

    /**
     * Update User's KYC
     * 
     * Update a company’s user kyc.
     */
    app.put('/kyc', authMiddleware.checkAuth, kycController.update);

    app.get('/kyc-level/:id', authMiddleware.checkAuth, kycController.kyc_level);

    //gets all kyc applications
    app.get('/all-kyc/', authMiddleware.checkAuth, kycController.show_all);



    /**
     * List User Products
     * 
     * Get a list of products belonging to CBI's user.
     */
    // app.get('/users/:id/products', authMiddleware.checkAuth, userController.products);

    /**
     * Groups
     * 
     * CBI inclused a group management system, that
     * allows admin users to create groups as well
     * as individually manage users’ permissions to
     * view, add, edit or delete data from the system
     * via admin endpoints.
     */
    app.post('/groups', authMiddleware.checkAuth, groupController.create);
    app.get('/groups', authMiddleware.checkAuth, groupController.index);
    app.get('/groups/:id', authMiddleware.checkAuth, groupController.show);
    app.put('/groups/:id', authMiddleware.checkAuth, groupController.update);
    app.put('/groups/:id/archive', authMiddleware.checkAuth, groupController.archive);
    app.delete('/groups/:id', authMiddleware.checkAuth, groupController.destroy);

    /**
     * Create Product Category
     * 
     * Create a product category belonging to CBI.
     */
    app.post('/products/categories', authMiddleware.checkAuth, productController.createCategory);

    /**
     * List Product Categories
     * 
     * Get a list of products belonging to CBI.
     */
    app.get('/products/categories', authMiddleware.checkAuth, productController.categories);

    /**
     * Get Product Category
     * 
     * Get a list of products belonging to CBI.
     */
    app.get('/products/categories/:id', authMiddleware.checkAuth, productController.showCategory);

    /**
    * Create Product Category
    * 
    * Create a product category belonging to CBI.
    */
    app.post('/products/categories', authMiddleware.checkAuth, productController.createCategory);

    /**
     * Update Categories
     * 
     * Update company’s categories details.
     */
    app.put('/products/categories/:id', authMiddleware.checkAuth, productController.updateCategory);
    /**
     * Create Product
     * 
     * Create a single product belonging to CBI.
     */
    app.post('/products', authMiddleware.checkAuth, productController.create);

    /**
     * List Products
     * 
     * Get a list of products belonging to CBI.
     */
    app.get('/products', authMiddleware.checkAuth, productController.index);

    /**
     * List Products History
     * 
     * Get a list of products history belonging to CBI.
     */
    app.get('/products/history', authMiddleware.checkAuth, productController.history);


    /**
     * Retrieve Product
     * 
     * Retrieve a company’s product.
     */
    app.get('/products/:id', authMiddleware.checkAuth, productController.show);

    /**
     * Retrieve Users By product Product
     * 
     * Retrieve a company’s product.
     */
    app.get('/products/:id/users', authMiddleware.checkAuth, productController.getMembersByProductId);

    /**
     * Update Product
     * 
     * Update company’s product details.
     */
    app.put('/products/:id', authMiddleware.checkAuth, productController.update);

    /**
     * Delete Product
     * 
     * Delete company’s product.
     */
    app.delete('/products/:id', authMiddleware.checkAuth, productController.destroy);

    /**
     * List Transactions
     * 
     * Get a list of transactions belonging to CBI.
     */
    app.get('/transactions', authMiddleware.checkAuth, transactionController.index);

    /**
     * Retrieve Transaction
     * 
     * Retrieve a company’s transaction.
     */
    app.get('/transactions/:id', authMiddleware.checkAuth, transactionController.show);
    
    app.get('/pop/deposits/:id', authMiddleware.checkAuth, transactionController.getProofOfPayment);

    /**
    * Update Product
    * 
    * Update company’s product details.
    */
    app.put('/transactions/:id', authMiddleware.checkAuth, userController.updateTransaction);

     /**
     * Process Batch Transactions.
     * 
     * Process Batch Transactions.
     */
    app.post('/transactions/batch', authMiddleware.checkAuth, transactionController.batchProcessTransaction);

    /**
     * List Currencies
     * 
     * Get a list of currencies belonging to CBI.
     */
    app.get('/currencies', authMiddleware.checkAuth, currencyController.index);

    /**
     * Retrieve Currency
     * 
     * Retrieve a company’s currency.
     */
    app.get('/currencies/:code', authMiddleware.checkAuth, currencyController.show);

    /**
     * Update Currency
     * 
     * Update company’s currency details.
     */
    app.put('/currencies/:code', authMiddleware.checkAuth, currencyController.update);

    /**
     * Delete Currency
     * 
     * Delete company’s currency.
     */
    app.delete('/currencies/:code', authMiddleware.checkAuth, currencyController.destroy);

     /**
     * Create Fee
     * 
     * Create a fee.
     */
    app.post('/fees', authMiddleware.checkAuth, feeController.create);

    /**
     * List Fees
     * 
     * Get a list of fees belonging to CBI.
     */
    app.get('/fees', authMiddleware.checkAuth, feeController.index);

    /**
     * Retrieve Fees
     * 
     * Retrieve a company’s fees (profile).
     */
    app.get('/fees/:id', authMiddleware.checkAuth, feeController.show);

    /**
     * Update User
     * 
     * Update user details.
     */
    app.put('/fees/:id', authMiddleware.checkAuth, feeController.update);

       /**
     * Create Setting
     * 
     * Create a setting.
     */
    app.post('/settings', authMiddleware.checkAuth, settingController.create);

    /**
     * List Setting
     * 
     * Get a list of settings belonging to CBI.
     */
    app.get('/settings', authMiddleware.checkAuth, settingController.index);

    /**
     * Retrieve Settings
     * 
     * Retrieve a company’s settings (profile).
     */
    app.get('/settings/:id', authMiddleware.checkAuth, settingController.show);

    /**
     * Update User
     * 
     * Update user details.
     */
    app.put('/settings/:id', authMiddleware.checkAuth, settingController.update);

    /**
     * Delete Setting
     * 
     * Delete Setting details.
     */
    app.delete("/settings/:id", authMiddleware.checkAuth, settingController.destroy);

    /**
     * List Companies
     * 
     * Get a list of Companies belonging to CBI.
     */
    app.get('/bank-accounts', authMiddleware.checkAuth, bankAccountController.index);
    app.get('/bank-accounts/pending', authMiddleware.checkAuth, bankAccountController.getBankAccountsPending);
    app.get('/bank-accounts/:id', authMiddleware.checkAuth, bankAccountController.show);
    app.post('/bank-accounts/verify/:id', authMiddleware.checkAuth, bankAccountController.verifyBankAccount);

    app.post('/bank-accounts/:id/auth/otp', authMiddleware.checkAuth, bankAccountController.otp);
    app.post('/bank-accounts/:id/auth/otp/resend', authMiddleware.checkAuth, bankAccountController.otpResend);
    app.post('/bank-accounts/:id/auth/otp/verify', authMiddleware.checkAuth, bankAccountController.otpVerify);

        /**
     * List Companies
     * 
     * Get a list of Companies belonging to CBI.
     */
    app.get('/companies', authMiddleware.checkAuth, companyController.getCompanies);
    /**
     * List Countries
     * 
     * Get a list of countries belonging to CBI.
     */
    app.get('/countries', authMiddleware.checkAuth, countryController.index);
    app.put('/countries/:id/blacklist', authMiddleware.checkAuth, countryController.blacklist);
    app.put('/countries/:id/unblacklist', authMiddleware.checkAuth, countryController.unblacklist);

    // buddyAPI Routes
    /**
     * @swagger
     * /lookup-balance:
     *   get:
     *     description: Retrieve balance of Buddy Main account. 
     *     responses:
     *       200:
     *         description: successful response.
     */
    app.get("/buddy/lookup-balance", authMiddleware.checkAuth, buddyAPIController.lookupBalance);
    /**
     * @swagger
     * /lookup-transactions:
     *   get:
     *     description: Return true or false while validating CBI user identifier. 
     *     responses:
     *       200:
     *         description: successful response.
     */
    app.get("/buddy/lookup-transactions", authMiddleware.checkAuth, buddyAPIController.lookupTransaction);
    /**
     * @swagger
     * /eventtransfer:
     *   post:
     *     description: Convert CBI's to Buddy $miles. 
     *     responses:
     *       200:
     *         description: successful response.
     */
    app.post("/buddy/eventtransfer", authMiddleware.checkAuth, buddyAPIController.eventTransfer);

    // buddyAccount Routes
    app.get("/buddy", authMiddleware.checkAuth, buddyAccountController.index);
    app.post("/buddy", authMiddleware.checkAuth, buddyAccountController.store);
    app.get("/buddy/:buddyId", authMiddleware.checkAuth, buddyAccountController.show);
    app.put("/buddy/:buddyId", authMiddleware.checkAuth, buddyAccountController.update);
    app.delete("/buddy/:buddyId", authMiddleware.checkAuth, buddyAccountController.destroy);


    // Permissions Level Routes
    app.get("/levels", authMiddleware.checkAuth, permissionLevelController.index);
    app.post("/level", authMiddleware.checkAuth, permissionLevelController.create);
    app.get("/level/:levelId", authMiddleware.checkAuth, permissionLevelController.show);
    app.put("/level/:buddyId", authMiddleware.checkAuth, permissionLevelController.update);
    app.delete("/level/:levelId", authMiddleware.checkAuth, permissionLevelController.destroy);


    // Page Permissions Routes
    app.get("/page_permissions", authMiddleware.checkAuth, pagePermissionController.index);
    app.get("/page_permissions/page_name/:page", authMiddleware.checkAuth, pagePermissionController.show);
    app.post("/page_permission", authMiddleware.checkAuth, pagePermissionController.create);
    // app.get("/level/:levelId", authMiddleware.checkAuth, permissionLevelController.show);
    app.put("/page_permissions/:id", authMiddleware.checkAuth, pagePermissionController.update);
    // app.delete("/level/:levelId", authMiddleware.checkAuth, permissionLevelController.destroy);

    app.get('/alltransactions', authMiddleware.checkAuth, transactionController.allTransactions);
    // Main Account Routes 
    app.get("/business-account", authMiddleware.checkAuth, accountController.mainaccount);

    // Main Account Balance Story ID 2401
    app.get("/transactions-type",  authMiddleware.checkAuth, transactionController.transactions);
    app.get("/transactions-total", authMiddleware.checkAuth, transactionController.transactionstotal);

};
