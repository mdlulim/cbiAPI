const async = require('async');
const moment = require('moment');
const accountService = require('../services/Account');
const archiveService = require('../services/Archive');
const commissionService = require('../services/Commission');
const cronService = require('../services/Cron');
const investmentService = require('../services/Investment');
const productService = require('../services/Product');
const settingService = require('../services/Setting');
const transactionService = require('../services/Transaction');
const userService = require('../services/User');
const wealthCreatorService = require('../services/WealthCreator');
const emailHandler = require('../helpers/emailHandler');
const sequelize = require('../config/db');
const { products } = require('../config');
const CONSTANTS = require('../constants');

const { FP } = products;
const { WEALTH_CREATOR } = CONSTANTS;

const getTxid = (subtype, autoid) => {
    return subtype.substr(0, 3).toUpperCase() + autoid.toString();
};

async function stars(req, res) {
    try {
        const { Op } = sequelize;
        const wealthCreators = await wealthCreatorService.index();

        if (wealthCreators && wealthCreators.length > 0) {
            
            // update wealth creator records
            // set stars for all back to zero
            // make a backup of all current wealth creators first
            await archiveService.create({
                relation: 'users',
                data: wealthCreators,
                service: 'cron-service_wc-stars',
                description: 'Wealth Creator Stars Back-Up',
            });
            await userService.bulkUpdate({ stars: 0 }, {
                referral_id: {
                    [Op.gte]: 0,
                }
            });

            return async.map(wealthCreators, async (item, callback) => {
                let stars = 0; // default is NO STAR

                // retrieve member/wc referrals
                const referrals = await userService.referrals(item.id);
                let directSponsored = 0;
                let downline = 0;
                let oneStar = 0;
                let twoStars = 0;
                let threeStars = 0;
                let fourStars = 0;
                let fiveStars = 0;
                let sixStars = 0;

                if (referrals && referrals.length > 0) {
                    referrals.map(item => {
                        if (item.level === 1) directSponsored++;   // direct sponsored/referral
                        if (item.level >= 1)  {
                            // downline stars
                            if (item.stars >= 6) sixStars++;
                            else if (item.stars >= 5) fiveStars++;
                            else if (item.stars >= 4) fourStars++;
                            else if (item.stars >= 3) threeStars++;
                            else if (item.stars >= 2) twoStars++;
                            else if (item.stars >= 1) oneStar++;

                            // downline
                            downline++;
                        }
                    });
                }

                // retrieve member fraxions
                const fraxions = await userService.fraxions(item.id);

                // * * * * * * * (7 stars)
                if (
                    fraxions >= WEALTH_CREATOR.STARS[7].FRAXIONS && 
                    directSponsored >= WEALTH_CREATOR.STARS[7].DIRECT_SPONSORED && 
                    downline >= WEALTH_CREATOR.STARS[7].DOWNLINE && 
                    sixStars >= WEALTH_CREATOR.STARS[7].FOUR_BY_STARS
                ) {
                    stars = 7;
                }

                // * * * * * * (6 stars)
                else if (
                    fraxions >= WEALTH_CREATOR.STARS[6].FRAXIONS && 
                    directSponsored >= WEALTH_CREATOR.STARS[6].DIRECT_SPONSORED && 
                    downline >= WEALTH_CREATOR.STARS[6].DOWNLINE && 
                    fiveStars >= WEALTH_CREATOR.STARS[6].FOUR_BY_STARS
                ) {
                    stars = 6;
                }

                // * * * * * (5 stars)
                else if (
                    fraxions >= WEALTH_CREATOR.STARS[5].FRAXIONS && 
                    directSponsored >= WEALTH_CREATOR.STARS[5].DIRECT_SPONSORED && 
                    downline >= WEALTH_CREATOR.STARS[5].DOWNLINE && 
                    fourStars >= WEALTH_CREATOR.STARS[5].FOUR_BY_STARS
                ) {
                    stars = 5;
                }

                // * * * * (4 stars)
                else if (
                    fraxions >= WEALTH_CREATOR.STARS[4].FRAXIONS && 
                    directSponsored >= WEALTH_CREATOR.STARS[4].DIRECT_SPONSORED && 
                    downline >= WEALTH_CREATOR.STARS[4].DOWNLINE && 
                    threeStars >= WEALTH_CREATOR.STARS[4].FOUR_BY_STARS
                ) {
                    stars = 4;
                }
                
                // * * * (3 stars)
                else if (
                    fraxions >= WEALTH_CREATOR.STARS[3].FRAXIONS && 
                    directSponsored >= WEALTH_CREATOR.STARS[3].DIRECT_SPONSORED && 
                    downline >= WEALTH_CREATOR.STARS[3].DOWNLINE && 
                    twoStars >= WEALTH_CREATOR.STARS[3].FOUR_BY_STARS
                ) {
                    stars = 3;
                }

                // * * (2 stars)
                else if (
                    fraxions >= WEALTH_CREATOR.STARS[2].FRAXIONS && 
                    directSponsored >= WEALTH_CREATOR.STARS[2].DIRECT_SPONSORED && 
                    downline >= WEALTH_CREATOR.STARS[2].DOWNLINE && 
                    oneStar >= WEALTH_CREATOR.STARS[2].FOUR_BY_STARS
                ) {
                    stars = 2;
                }

                // * (1 star)
                else if (
                    fraxions >= WEALTH_CREATOR.STARS[1].FRAXIONS && 
                    directSponsored >= WEALTH_CREATOR.STARS[1].DIRECT_SPONSORED && 
                    downline >= WEALTH_CREATOR.STARS[1].DOWNLINE
                ) {
                    stars = 1;
                }

                // update member/wc record, set stars
                // await userService.update({
                //     stars,
                // }, item.id);

                return {
                    ...item,
                    // referrals,
                    downline,
                    directSponsored,
                    fraxions,
                    stars,
                };
            }, (err, results) => {
                if (err) throw err;
                return res.send({
                    success: true,
                    results,
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
}

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
        const { permakey } = req.params;
        const product = await productService.findByPermakey(permakey);

        if (product && product.id) {
            const { product_category } = product;
            switch (product_category.code) {
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
        const { permakey } = req.params;
        const product = await productService.findByPermakey(permakey);

        if (product && product.id) {
            const { product_category } = product;
            switch (product_category.code) {
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


/**
 * 
 * MLM Commission Structure Payout
 * 
 * @param {object}  res
 * @param {object}  data
 * 
 * @return {object}
 */
async function commissionPayout(res, data) {
    try {
        const {
            user,
            amount,
            product,
            transaction,
            educator_percentage,
            commission_structure,
        } = data;

        if (commission_structure && educator_percentage) {
            const upline = await userService.upline(user.id);
            if (upline.length > 0) {
                var level = 1;
                return async.map(upline, async (item) => {
                    const { account } = item;
                    const commission = amount * parseFloat(commission_structure[`level${level}`]) / 100;

                    // update account balance
                    await accountService.update({
                        balance: parseFloat(account.balance) + commission,
                        available_balance: parseFloat(account.available_balance) + commission,
                    }, account.id);

                    // log transaction
                    const transact = await transactionService.create({
                        tx_type: 'credit',
                        subtype: 'educator-fees',
                        user_id: item.id,
                        amount: commission,
                        reference: `EduComm-${product.product_code}`,
                        note: `Received ${commission} ${product.currency.code} from ${user.first_name} (${user.username}) on ${product.type} ${product.title}`,
                        currency: product.currency,
                        total_amount: commission,
                        status: 'Completed',
                    });

                    // update transaction
                    const txid = product.product_code + transact.auto_id;
                    const metadata = {
                        entity: 'transactions',
                        refid: transaction.id,
                        type: 'crypto',
                        currency: 'CBI',
                        currency_code: 'CBI',
                        level,
                        level_percentage: commission_structure[`level${level}`],
                    };
                    await transactionService.update({
                        txid,
                        metadata,
                    }, transact.id);

                    // next level
                    level++;

                    return {
                        item,
                        txid,
                        commission,
                    };

                }, (err, results) => {
                    if (err) {
                        return res.status(500)
                            .send({
                                success: false,
                                message: 'Could not process your request'
                            });
                    }
                    return res.send({
                        success: true,
                        data: results,
                    });
                });
            }
        }

        // response
        return res.send({ success: true });

    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

module.exports = {
    stars,
    autorenew,
    autorenewNotify,
    index,
    productDailyEarnings,
    productWeeklyEarnings,
}