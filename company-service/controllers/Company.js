const companyService = require('../services/Company');
const userService    = require('../services/User');

/**
 * Retrieve Company Details
 * 
 * Retrieve current user’s company details.
 * 
 * @param {object} req 
 * @param {object} res 
 */
async function profile(req, res){
    try {
        const user = await userService.show(req.user.id);
        return companyService.profile(user.company_id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        })
    }
};


/**
 * List Company Currencies
 * 
 * Get a list of available currencies for the 
 * current user’s company.
 * 
 * @param {object} req 
 * @param {object} res 
 */
async function currencies(req, res){
    try {
        const user = await userService.show(req.user.id);
        return companyService.currencies(user.company_id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        })
    }
};


/**
 * List Company Banks
 * 
 * Get a list of company banks for the current
 * user’s company.
 * 
 * @param {object} req 
 * @param {object} res 
 */
async function bankAccounts(req, res){
    try {
        return companyService.bankAccounts(req.query)
        .then(data => res.send(data));
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        })
    }
};


/**
 * List Company Crypto Accounts
 * 
 * Get a list of company crypto accounts for the current
 * user’s company.
 * 
 * @param {object} req 
 * @param {object} res 
 */
async function cryptoAccounts(req, res){
    try {
        return companyService.cryptoAccounts()
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        })
    }
};


/**
 * List Company Crypto Accounts
 * 
 * Get a list of company crypto accounts for the current
 * user’s company.
 * 
 * @param {object} req 
 * @param {object} res 
 */
async function settings(req, res){
    try {
        const user = await userService.show(req.user.id);
        return companyService.settings(user.company_id, req.query)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        })
    }
};

module.exports = {
    profile,
    currencies,
    bankAccounts,
    cryptoAccounts,
    settings,
};
