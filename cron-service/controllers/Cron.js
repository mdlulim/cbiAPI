const async = require('async');
const moment = require('moment');
const accountService = require('../services/Account');
const commissionService = require('../services/Commission');
const cronService = require('../services/Cron');
const investmentService = require('../services/Investment');
const productService = require('../services/Product');
const settingService = require('../services/Setting');
const transactionService = require('../services/Transaction');
const userService = require('../services/User');
const emailHandler = require('../helpers/emailHandler');
const sequelize = require('../config/db');
const { products } = require('../config');
const { FP, FX } = products;

const getTxid = (subtype, autoid) => {
    return subtype.substr(0, 3).toUpperCase() + autoid.toString();
};

/**
 * Auto-renew wealth creator membership
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function autorenew(req, res) {
    try {
        /* 
         * Retrieve all wealth-creators whose membership is due to expire today
         * and has auto-renewal flag turned ON under their profile
         */
        const { Op } = sequelize;
        const wealthCreators = await userService.wcDueForAutoRenew(req.query);
        const [wcRenewalMonthlyFee] = await settingService.config({
            key: {
                [Op.or]: [
                    'wc_renewal_monthly_fee',
                    'wc_renewal_annual_fee',
                ]
            },
            category: 'system',
            subcategory: 'config',
        });
        const autoRenewalFee = parseFloat(wcRenewalMonthlyFee.value);
        
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
async function autorenewNotify(req, res) {
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
async function productDailyEarnings(req, res){
    try {
        const { code } = req.params;
        const product = await productService.findByCode(code);

        if (product && product.id) {
            const { product_category } = product;
            switch (product_category.code) {
                case FX:
                    break;
                    
                case FP: return fixedPlansDailyEarnings(product, res);
            }
        }
        return res.status(403).send({
            success: false,
            message: 'Product not found'
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
 * Calculate and payout member commission for a specific product
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function productWeeklyEarnings(req, res){
    try {
        const { code } = req.params;
        const product = await productService.findByCode(code);

        if (product && product.id) {
            const { product_category } = product;
            switch (product_category.code) {
                case FX:
                    
                    break;
                    
                case FP: return fixedPlansWeeklyEarnings(product, res);
            }
        }
        return res.status(403).send({
            success: false,
            message: 'Product not found'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
};

/*
	Eg. Nkosi invests in Plan 2 at 0.30% daily interest. After one week 
    (currently 5 days) his earning are (0.30% x 5 = 1.5%)

	Calculation (Of the 1.5% - 65% of value get paid out into members
    wallet, 35% get re-invested and is added back to initial investment amount for compounding)
*/
async function fixedPlansDailyEarnings(product, res) {
    const {
        type,
        title,
        weekly_dividends,
        product_code,
    } = product;
    const dayOfWeek = moment().isoWeekday();

    // Dividends are only calculated between Monday (1) and Friday (5)
    if (dayOfWeek > 5) {
        return res.status(203).send({
            success: true,
            message: 'Payouts and/or calculations occur during weekdays',
        });
    }

    // check if weekly_dividends
    if (!weekly_dividends) {
        return res.status(203).send({
            success: true,
            message: `No weekly dividends for ${title} (${type})`,
        });
    }
    const investments = await investmentService.findActive();
    return async.map(investments, async (item, callback) => {
        const {
            id,
            user,
            daily_interest,
            last_updated,
            invested_amount,
            accumulated_amount,
        } = item;
        const dailyInterest       = parseFloat(daily_interest); // estimated daily interest
        const compoundedAmount    = parseFloat(accumulated_amount);
        const earnings            = dailyInterest / 100 * compoundedAmount;
        const reInvestedAmount    = earnings * 0.35; // 35% to be re-invested (compounding)
        const interestAmount      = earnings * 0.65; // 65% to be paid to members wallet
        const accumulatedAmount   = compoundedAmount + reInvestedAmount;

        // check if already paid for the current day
        if (last_updated) {
            if (moment().isSame(last_updated)) {
                return;
            }
        }

        // update investment record
        // compound the amount
        const reInvestment = {
            accumulated_amount: accumulatedAmount,
        };
        await investmentService.update(id, reInvestment);

        // log commission earnings record
        const commissionData = {
            type: product_code.toUpperCase(),
            user_id: user.id,
            referral_id: user.id,
            amount: interestAmount,
        };
        await commissionService.create(commissionData);

        // log transaction (into transactions table) as "interest"
        // const transactionData = {
        //     tx_type: 'debit',
        //     subtype: 'interest',
        //     reference: `${product_code}-Earnings`,
        //     note: `Earnings from ${title}`,
        //     fee: 0,
        //     amount: interestAmount,
        //     total_amount: interestAmount,
        //     balance: available_balance,
        //     user_id: user.id,
        // };
        // const transaction = await transactionService.create(transactionData);
        // const txid = getTxid(product_code, transaction.auto_id);
        // await transactionService.update({ txid }, transaction.id);

        return {
            invested_amount: parseFloat(invested_amount),
            daily_interest: dailyInterest,
            compounded_amount: compoundedAmount,
            earnings_today: earnings,
            reinvested_amount: reInvestedAmount,
            interest_amount: interestAmount,
            accumulated_amount: accumulatedAmount,
            notification: null,
            last_updated,
        };
    }, (err, results) => {
        if (err) throw err;
        return res.send({
            success: true,
            results,
        });
    });
}

/*
	Eg. Nkosi invests in Plan 2 at 0.30% daily interest. After one week 
    (currently 5 days) his earning are (0.30% x 5 = 1.5%)

	Calculation (Of the 1.5% - 65% of value get paid out into members
    wallet, 35% get re-invested and is added back to initial investment amount for compounding)
*/
async function fixedPlansWeeklyEarnings(product, res) {
    const {
        type,
        title,
        weekly_dividends,
        product_code,
    } = product;
    const dayOfWeek = moment().isoWeekday();

    // Dividends are only paid on Saturdays (6)
    if (dayOfWeek === 6) {
        return res.status(203).send({
            success: true,
            message: 'Dividends and/or payouts occur ONLY on Saturdays',
        });
    }

    // check if weekly_dividends
    if (!weekly_dividends) {
        return res.status(203).send({
            success: true,
            message: `No weekly dividends/payouts for ${title} (${type})`,
        });
    }
    const investments = await investmentService.findActive();
    return async.map(investments, async (item, callback) => {
        const {
            id,
            daily_interest,
            last_updated,
            invested_amount,
            accumulated_amount,
        } = item;
        const dailyInterest       = parseFloat(daily_interest); // estimated daily interest
        const compoundedAmount    = parseFloat(accumulated_amount);
        const earnings            = dailyInterest / 100 * compoundedAmount;
        const reInvestedAmount    = earnings * 0.35; // 35% to be re-invested (compounding)
        const interestAmount      = earnings * 0.65; // 65% to be paid to members wallet
        const accumulatedAmount   = compoundedAmount + reInvestedAmount;

        // check if already paid for the current day
        if (last_updated) {
            if (moment().isSame(last_updated)) {
                return;
            }
        }

        // update investment record
        // compound the amount
        const reInvestment = {
            accumulated_amount: accumulatedAmount,
        };
        await investmentService.update(id, reInvestment);

        // log commission earnings record
        const commissionData = {
            type: product_code.toUpperCase(),
            user_id: user.id,
            referral_id: user.id,
            amount: interestAmount,
        };
        await commissionService.create(commissionData);

        // log transaction (into transactions table) as "interest"
        // const transactionData = {
        //     tx_type: 'debit',
        //     subtype: 'interest',
        //     reference: `${product_code}-Earnings`,
        //     note: `Earnings from ${title}`,
        //     fee: 0,
        //     amount: interestAmount,
        //     total_amount: interestAmount,
        //     balance: available_balance,
        //     user_id: user.id,
        // };
        // const transaction = await transactionService.create(transactionData);
        // const txid = getTxid(product_code, transaction.auto_id);
        // await transactionService.update({ txid }, transaction.id);

        return {
            invested_amount: parseFloat(invested_amount),
            daily_interest: dailyInterest,
            compounded_amount: compoundedAmount,
            earnings_today: earnings,
            reinvested_amount: reInvestedAmount,
            interest_amount: interestAmount,
            accumulated_amount: accumulatedAmount,
            notification: null,
            last_updated,
        };
    }, (err, results) => {
        if (err) throw err;
        return res.send({
            success: true,
            results,
        });
    });
}

module.exports = {
    autorenew,
    autorenewNotify,
    index,
    productDailyEarnings,
    productWeeklyEarnings,
}