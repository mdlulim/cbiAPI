const async = require('async');
const moment = require('moment');
const accountService = require('../services/Account');
const cronService = require('../services/Cron');
const settingService = require('../services/Setting');
const transactionService = require('../services/Transaction');
const userService = require('../services/User');
const emailHandler = require('../helpers/emailHandler');

const getTxid = (subtype, autoid) => {
    return subtype.substr(0, 3).toUpperCase() + autoid.toString();
};

/**
 * Auto-renew wealth creator membership
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function autorenew(req, res){
    try {
        /* 
         * Retrieve all wealth-creators whose membership is due to expire today
         * and has auto-renewal flag turned ON under their profile
         */
        const wealthCreators = await userService.wcDueForAutoRenew(req.query);
        const [autoRenewalSetting] = await settingService.config({
            key: 'wc_renewal_monthly_fee',
            category: 'system',
            subcategory: 'config',
        });
        const autoRenewalFee = parseFloat(autoRenewalSetting.value);
        
        if (wealthCreators && wealthCreators.length > 0) {
            return async.map(wealthCreators, async (item, callback) => {
                const {
                    id,
                    account,
                    notification,
                } = item;
                const {
                    available_balance,
                    balance,
                } = account;

                /* 
                * Check if available balance is enough for the transaction
                * and update or deduct from user's wallet
                */
                if (available_balance && parseFloat(available_balance) >= autoRenewalFee) {
                    const expiry = moment().add(1, 'month').format('YYYY-MM-DD');

                    // deduct funds from wallet
                    const accAvailableBalance = parseFloat(available_balance);
                    const accBalance = parseFloat(balance);
                    const walletUpdate = {
                        available_balance: accAvailableBalance - autoRenewalFee,
                        balance: accBalance - autoRenewalFee,
                    };
                    await accountService.update(walletUpdate);

                    // log transaction record
                    const renewalTansaction = {
                        tx_type: 'debit',
                        subtype: 'wcrenewal',
                        reference: 'WC-Monthly-Renewal',
                        note: 'Wealth Creator Monthly Renewal',
                        destination_transaction: null,
                        source_transaction: account.reference,
                        status: 'Completed',
                        fee: 0,
                        amount: autoRenewalFee,
                        total_amount: autoRenewalFee,
                        user_id: id,
                    };
                    const transaction = await transactionService.create(renewalTansaction);
                    const txid = getTxid('wcrenewal', transaction.auto_id);
                    await transactionService.update({ txid }, transaction.id);

                    // update wealth-creator's expiry
                    // add another month
                    await userService.update({ expiry }, id);

                    /* 
                    * Check if member's notifications turned ON
                    * and send email notification
                    */
                    if (notification && notification.email === true) {
                        const result = await emailHandler.autoRenewNotify({
                            ...item,
                            txid,
                            expiry,
                            amount: autoRenewalFee.toFixed(4),
                        });
                        return {
                            ...item,
                            transaction,
                            renewal_status: false,
                            failed_reason: null,
                            notification: result
                        };
                    }
                    return {
                        ...item,
                        transaction,
                        renewal_status: false,
                        failed_reason: null,
                        notification: null,
                    };
                }
                return {
                    ...item,
                    renewal_status: false,
                    failed_reason: 'Insufficient funds'
                };
            }, (err, results) => {
                if (err) throw err;
                console.log(results);
                return res.send({
                    success: true,
                    results,
                    data: {
                        count: wealthCreators.length,
                        results: wealthCreators,
                    }
                });
            });
        }
        return res.send({
            success: true,
            data: null,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
};

/**
 * Send notification for wealth-creators whose membership is due to expire within next 5 days
 * and has auto-renewal flag turned OFF under their profile
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function autorenewNotify(req, res){
    try {
        /* 
         * Retrive all wealth-creators whose membership is due to expire within next 5 days
         * and has auto-renewal flag turned OFF under their profile
         */
        const wealthCreators = await userService.wcEligibleForAutoRenewNotify(req.query);
        if (wealthCreators && wealthCreators.length > 0) {
            return async.map(wealthCreators, async (item, callback) => {
                if (item.notification && item.notification.email === true) {
                    const result = await emailHandler.autoRenewExpiryNotify(item);
                    return {
                        ...item,
                        notification: result,
                    };
                }
                return {
                    ...item,
                    notification: null,
                };
            }, (err, results) => {
                if (err) throw err;
                console.log(results);
                return res.send({
                    success: true,
                    results,
                    data: {
                        count: wealthCreators.length,
                        results: wealthCreators,
                    }
                });
            });
        }
        return res.send({
            success: true,
            data: null,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
};

async function index(req, res){
    try {
        const cronjobs = await cronService.index(req.query);
        return res.send({
            success: true,
            data: cronjobs,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
};

/**
 * Calculate member commission for a specific product
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function productCommission(req, res){
    try {
        const { code } = req.params;
        return res.send({
            success: true,
            code,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
};

module.exports = {
    autorenew,
    autorenewNotify,
    index,
    productCommission,
}