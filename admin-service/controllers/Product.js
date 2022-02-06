const axios = require('axios');
const async = require('async');
const moment = require('moment');
const config = require('../config');
const sequelize = require('../config/db');
const accountService = require('../services/Account');
const activityService = require('../services/Activity');
const commissionService = require('../services/Commission');
const investmentService = require('../services/Investment');
const productService = require('../services/Product');
const settingService = require('../services/Setting');
const transactionService = require('../services/Transaction');
const userService = require('../services/User');
const { cancellationConfirmation } = require('../helpers/emailHandler');

function permakey(title) {
    return title.split(' ')
        .join('-')
        .trim()
        .toLowerCase();
}

const getTxid = (prefix, autoid) => {
    return prefix.toUpperCase() + autoid.toString();
};

async function createCategory(req, res) {
    try {
        const data = req.body;
        await productService.createCategory(data);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.add-category`,
            description: `${req.user.group_name} added a new product category (${data.title})`,
            subsection: 'Add Category',
            section: 'Products',
            ip: null,
            data,
        });
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function create(req, res) {
    try {
        const data = req.body;
        data.captured_by = req.user.id;
        data.permakey = permakey(data.title);
        // check product by unique permakey/code
        const product = await productService.findByPermakey(data.permakey);
        if (product && product.id) {
            return res.status(403).send({
                success: false,
                message: 'Validation error. Same product name already exists'
            });
        }

        await productService.create(data);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.add`,
            description: `${req.user.group_name} added a new product (${data.title})`,
            section: 'Products',
            subsection: 'Add',
            ip: null,
            data,
        });
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function index(req, res) {
    try {
        const products = await productService.index(req.query);

        const { count, rows } = products;
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function history(req, res) {
    try {
        const products = await productService.history(req.query);
        const { count, rows } = products[0];
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: products[0],
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}



async function cancellations(req, res) {
    try {
        const products = await productService.cancellations(req.query);
        const { count, rows } = products;

        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function cancelStatus(req, res) {
    try {
        const data = req.body;
        await productService.cancelStatus(data.id, { status: data.status });
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function getMembersByProductId(req, res) {
    try {
        const members = await productService.getMembersByProductId(req.params.id);
        const { count, rows } = members[0];
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: members[0],
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function show(req, res) {
    try {
        const product = await productService.show(req.params.id);
        return res.send({
            success: true,
            data: product
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function showCategory(req, res) {
    try {
        const category = await productService.showCategory(req.params.id);
        return res.send({
            success: true,
            data: category
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function showSubcategory(req, res) {
    try {
        const category = await productService.showSubcategory(req.params.id);
        return res.send({
            success: true,
            data: category
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function subcategoryCalculations(req, res) {
    try {
        const subcategory = await productService.showSubcategory(req.params.id);
        if (subcategory && subcategory.code === 'FX') {
            const { indicators } = subcategory;
            const { ref_id } = indicators;
            const params = { ...req.query, ref_id };
            const data = await productService.fraxionCalculations(params);
            const { count, rows } = data;
            return res.send({
                success: true,
                data: {
                    count,
                    results: rows,
                }
            });
        }
        return res.send({
            success: true,
            data: null
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function processPayouts(req, res) {
    try {

        // retrieve product information
        const productSubcategory = await productService.showSubcategory(req.params.id);
        const { code } = productSubcategory;

        // product check
        const isFX = config.products.FX === code;

        switch (true) {
            case isFX: return fxPayouts(req, res, productSubcategory);
        }

        return res.send({
            success: true,
            data: null,
        });
    } catch (error) {
        console.log(error.message || '=====error=====');
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function fxPayouts(req, res, productSubcategory) {
    try {

        // get current fraxion holders
        const fraxionHolders = await productService.fraxionHolders();

        if (fraxionHolders && fraxionHolders.length > 0) {

            /**
             * START: Conversions and Calculations
             */

            // fetch USD/ZAR rate
            const { exchange } = config;
            const usdZarRate = await axios({
                mode: 'no-cors',
                method: 'GET',
                url: `${exchange.baseurl}exchangerate/USD/ZAR?apikey=${exchange.apikey}`,
                headers: { 'Content-Type': 'application/json' },
                crossdomain: true,
            })
                .then((json) => json.data)
                .then(res => {
                    const { rate } = res;
                    return rate || null;
                });

            // retrieve settings to get CBI/ZAR rate
            const configuration = await settingService.config();
            var settings = {};

            if (configuration && configuration.length > 0) {
                configuration.map(item => {
                    const { key, value } = item;
                    settings[key] = value;
                });
            }
            const { cbi_zar_value, transaction_fee_percentage } = settings;

            // retrieve product information to get educator percentage
            const { code, indicators, description } = productSubcategory;
            const { commission_structure, educator_percentage } = indicators;

            const commissions = [];
            var payoutTotal = 0;
            var educatorFees = 0;

            // retrieve payout amounts in CBI
            const { payout_amount, educator_amount, start_date, end_date } = req.body;
            const transactionFees = (parseFloat(cbi_zar_value) * parseFloat(transaction_fee_percentage) / 100);
            const cbiToZar = parseFloat(cbi_zar_value) + transactionFees;
            const payoutAmount = (parseFloat(payout_amount) * parseFloat(usdZarRate) / cbiToZar); // per FX Unit
            const educatorAmount = (parseFloat(educator_amount) * parseFloat(usdZarRate) / cbiToZar); // per FX Unit

            // insert payout record
            const commissionPayout = await commissionService.createPayout({
                product_code: code,
                payment_date: new Date().toISOString(),
                captured_by: req.user.id,
                data: {
                    ...req.body,
                },
            });

            return async.map(fraxionHolders, async (member) => {
                /**
                 * START: Process Fraxion Payout
                 */
                const { fraxions } = member;
                const units = parseInt(fraxions);
                const memberPayout = payoutAmount * units;
                const unitAmount = payoutAmount;
                payoutTotal += memberPayout;

                // update account balance
                var { account } = member;
                
                await accountService.update({
                    balance: parseFloat(account.balance) + memberPayout,
                    available_balance: parseFloat(account.available_balance) + memberPayout,
                }, account.id);

                // log transaction
                const memberTransaction = await transactionService.create({
                    tx_type: 'credit',
                    subtype: `${code.toLowerCase()}-payouts`,
                    user_id: member.id,
                    amount: memberPayout,
                    reference: `EduComm-${code}`,
                    note: `Received ${memberPayout.toFixed(4)} CBI on ${description} Payout`,
                    total_amount: memberPayout,
                    status: 'Completed',
                });

                // update transaction
                if (memberTransaction.id) {
                    var txid = code + memberTransaction.auto_id;
                    var metadata = {
                        type: 'crypto',
                        currency: 'CBI',
                        currency_code: 'CBI',
                        entity: 'commissions',
                        refid: commissionPayout.id,
                    };
                    await transactionService.update({ txid, metadata }, memberTransaction.id);
                }

                // retrieve fraxion holder's uplines
                const uplines = await userService.upline(member.id);

                if (uplines && uplines.length > 0) {
                    var level = 1;

                    /**
                     * Perform Educator Fee payout to Upline
                     * 
                     * Educators fees are payable to Wealth Creators ONLY who qualifies
                     * in accordance to 10 Level Structure.
                     * 
                     * This is payable when the Profits are declared a % for education
                     * will be declared and this is allocated in accordance with the 10
                     * level structure.
                     */
                    return async.map(uplines, async (upline) => {
                        var { account } = upline;
                        const commission = educatorAmount * parseFloat(commission_structure[`level${level}`]) / 100;
                        educatorFees += commission;
    
                        // update account balance
                        await accountService.update({
                            balance: parseFloat(account.balance) + commission,
                            available_balance: parseFloat(account.available_balance) + commission,
                        }, account.id);
    
                        // log transaction
                        const uplineTransaction = await transactionService.create({
                            tx_type: 'credit',
                            subtype: 'educator-fees',
                            user_id: upline.id,
                            amount: commission,
                            reference: `EduComm-${code}`,
                            note: `Received ${commission.toFixed(4)} ${code} from ${member.first_name} (${member.username}) on ${description}`,
                            total_amount: commission,
                            status: 'Completed',
                        });
    
                        // update transaction
                        var txid = code + uplineTransaction.auto_id;
                        var metadata = {
                            entity: 'transactions',
                            refid: memberTransaction.id,
                            type: 'crypto',
                            currency: 'CBI',
                            currency_code: 'CBI',
                            level,
                            level_percentage: commission_structure[`level${level}`],
                        };
                        await transactionService.update({ txid, metadata }, uplineTransaction.id);
    
                        level++;

                        commissions.push({
                            user_id: upline.id,
                            type: `${code.toLowerCase()}-EDU-FEES`,
                            referral_id: commissionPayout.id,
                            amount: commission,
                            status: 'Paid',
                            currency_code: 'CBI',
                            commission_date: new Date(),
                            metadata: {
                                level,
                                percentage: commission_structure[`level${level}`],
                            },
                        });
    
                        return { commission, upline, txid };
                        
                    }, (err, results) => {
                        if (err) {
                            console.error(err.message || '---- errror -----');
                            return res.status(500)
                                .send({
                                    success: false,
                                    message: 'Could not process your request'
                                });
                        }
                        return results;
                    });
                }

                commissions.push({
                    user_id: member.id,
                    type: `${code.toUpperCase()}-PROFIT-PAYOUT`,
                    referral_id: memberTransaction.id,
                    amount: memberPayout,
                    status: 'Paid',
                    currency_code: 'CBI',
                    commission_date: new Date(),
                    metadata: {
                        uplines,
                        unit_amount: unitAmount,
                        amount_paid: memberPayout,
                    },
                });

                return {
                    ...member,
                    uplines,
                    unit_amount: unitAmount,
                    amount_paid: memberPayout,
                };
            }, async (err, results) => {
                if (err) {
                    console.error(err.message || '---- errror -----');
                    return res.status(500)
                        .send({
                            success: false,
                            message: 'Could not process your request'
                        });
                }

                // log commission payments
                await commissionService.bulkCreate(commissions);

                // update product sub-category
                await productService.updateSubcategory(productSubcategory.id, {
                    indicators: {
                        ...indicators,
                        payout: {
                            end_date,
                            start_date,
                            last_payout_date: moment().format('YYYY-MM-DD'),
                        }
                    }
                });

                // log activity
                await activityService.addActivity({
                    user_id: req.user.id,
                    action: `${req.user.group_name}.products.process-payout`,
                    description: `${req.user.group_name} processed/declared payout for ${description.toLowerCase()} product`,
                    subsection: 'Products',
                    section: `${description} (${code}) Payout`,
                    data: req.body,
                    ip: null,
                });

                // update payout
                await commissionService.updatePayout(commissionPayout.id, {
                    data: {
                        ...req.body,
                        educator_percentage,
                        commission_structure,
                        educator_fees: educatorFees,
                        payout_total: payoutTotal,
                        usd_zar_rate: usdZarRate,
                        cbi_to_zar: cbiToZar,
                        cbi_zar_value,
                        results,
                    }
                });

                return res.send({
                    success: true,
                    data: {
                        end_date,
                        start_date,
                        educator_percentage,
                        educator_fees: educatorFees,
                        payout_total: payoutTotal,
                        usd_zar_rate: usdZarRate,
                        cbi_to_zar: cbiToZar,
                        cbi_zar_value,
                        results,
                    }
                });
            });
        }
        return res.send({
            success: true,
            data: {
                fraxion_holders: fraxionHolders,
            }
        });
    } catch (err) {
        console.log(err.message || '======= ERRROR =======');
        return res.status(500).send({
            success: false,
            message: 'Could not process request',
        });
    }
}

async function captureCalculations(req, res) {
    try {
        const subcategory = await productService.showSubcategory(req.params.id);
        if (!subcategory) {
            return res.status(403).send({
                success: false,
                message: 'Specified subcategory not found'
            });
        }
        const { code, has_payouts } = subcategory;
        if (!has_payouts) {
            return res.status(403).send({
                success: false,
                message: 'Specified subcategory calculations does not support calculations/payouts'
            });
        }

        var data = null;
        const isFX = code.toUpperCase() === 'FX';

        // update subcategory
        // for now only Fraxion (Staking) calculations are supported
        if (isFX) {
            const { fn } = sequelize;
            const { id, indicators, title } = subcategory;
            const {
                ref_id,
                compound_pool,
                main_pool,
                reserve_pool,
                start_date,
                end_date,
            } = indicators;
            const subcategoryUpdate = {
                indicators: {
                    ...indicators,
                    last_updated: fn('NOW'),
                    last_calculation: fn('NOW'),
                    compound_pool: {
                        balance_current: parseFloat(req.body.p3crv_compounding),
                        balance_previous: compound_pool.balance_current,
                    },
                    main_pool: {
                        balance_current: parseFloat(req.body.pool),
                        balance_previous: main_pool.balance_current,
                    },
                    reserve_pool: {
                        balance_current: parseFloat(req.body.reserve_pool),
                        balance_previous: reserve_pool.balance_current,
                    },
                }
            };
            await productService.updateSubcategory(id, subcategoryUpdate);

            // capture calculations
            const calculations = {
                ...req.body,
                captured_by: req.user.id,
                start_date,
                end_date,
                ref_id,
            }
            data = await productService.captureFraxionCalculations(calculations);

            // activity log
            await activityService.addActivity({
                user_id: req.user.id,
                action: `${req.user.group_name}.products.process-calculations`,
                description: `${req.user.group_name} processed calculations for product sub-category (${title})`,
                subsection: 'Products',
                section: `${title} Calculations`,
                data: req.body,
                ip: null,
            });
        }

        // return response object
        return res.send({
            success: true,
            data,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function update(req, res) {
    try {
        const data = req.body;
        await productService.update(req.params.id, data);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.update`,
            description: `${req.user.group_name} updated a product (${data.title})`,
            section: 'Products',
            subsection: 'Update',
            ip: null,
            data: {
                ...data,
                id: req.params.id,
            },
        });
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function updateCategory(req, res) {
    return productService.updateCategory(req.params.id, req.body)
        .then(data => res.send(data))
        .catch(err => {
            console.log(err.message)
            res.send({
                success: false,
                message: err.message,
            });
        });
}

// async function updateSubcategory(req, res) {
//     return productService.updateSubcategory(req.params.id, req.body)
//     .then(data => res.send(data))
//     .catch(err => {
//         console.log(err.message)
//         res.send({
//             success: false,
//             message: err.message,
//         });
//     });
// }

async function updateSubcategory(req, res) {
    try {
        await productService.updateSubcategory(req.params.id, req.body);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.subcategory.update`,
            description: `${req.user.group_name} updated a product subcategory (${req.body.title})`,
            subsection: 'Update Sub-Category',
            section: 'Products',
            data: req.body,
            ip: null,
        });
        return res.send({
            success: true,
            message: 'successfully updated',
        });
    } catch (error) {
        return {
            success: false,
            message: 'Could not process request'
        };
    }
}

async function destroy(req, res) {
    try {
        const data = await productService.show(req.params.id);
        await productService.destroy(req.params.id);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.delete`,
            description: `${req.user.group_name} deleted a product (${data.title})`,
            section: 'Products',
            subsection: 'Delete',
            ip: null,
            data,
        });
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function categories(req, res) {
    try {
        const categories = await productService.categories(req.query);
        const { count, rows } = categories;
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function getSubcategories(req, res) {
    try {
        const categories = await productService.getSubcategories(req.query);
        const { count, rows } = categories;
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function cancellationsAction(req, res) {
    try {
        const { type } = req.params;
        const {
            user_product_id,
            product_id,
            member_id,
            reason,
        } = req.body;

        // get user product
        const userProduct = await productService.showUserProduct(user_product_id);

        // retrieve settings config
        const settings = await settingService.findByKey('product_cancellation_penalty_fee');

        // retrieve product by id
        const product = await productService.show(product_id);
        const { title, product_code, product_subcategory, fees } = product;
        const { code, allow_cancellations } = product_subcategory;

        if (!allow_cancellations) {
            return res.status(403).send({
                success: false,
                message: 'Cancellations on this product not allowed'
            });
        }

        // apply cancellation penalties if any, and
        // top-up member wallet balance accordingly
        let isPercentage = false;
        let cancellationFees = 0;
        if (fees && fees.cancellation_penalty_fee) {
            cancellationFees = parseFloat(fees.cancellation_penalty_fee);
        } else if (settings & settings.value) {
            if (settings.value.includes('%')) {
                // this is a percentage value
                isPercentage = true;
            }
            cancellationFees = parseFloat(settings.value);
        }

        // update status
        const action = (type === 'approve') ? 'approved' : 'rejected';
        const status = (type === 'approve') ? 'Cancellation Complete' : 'Active';
        const cancellationStatus = (type === 'approve') ? 'Complete' : 'Rejected';
        const updated = await productService.cancelStatus(user_product_id, {
            status,
            reason,
            cancellation_status: cancellationStatus,
            cancellation_approved_by: req.user.id,
        });

        if (updated) {

            // retrieve member by id
            const member = await userService.show(member_id, false);

            if (type === 'approve') {

                let creditAmount = 0;
                switch (code) {
                    // calculate fixed plans cancellations
                    case 'FP':
                        // retrieve investment record
                        const investment = await investmentService.show({
                            user_product_id: userProduct.id,
                        });

                        if (investment.id) {
                            const { invested_amount } = investment;

                            // update investment record
                            await investmentService.update(investment.id, {
                                status: 'Cancelled',
                            });

                            // calculations (invested amount minus cancellation penalty fees)
                            const investedAmount = parseFloat(invested_amount);
                            const feeAmount = (isPercentage) ? (investedAmount * cancellationFees / 100) : cancellationFees;
                            creditAmount = investedAmount - feeAmount;
                        }
                        break;
                }

                if (creditAmount > 0) {
                    // retrieve member's wallet
                    const wallet = await accountService.wallet(member_id);

                    // log transaction
                    const currency = await currencyService.show(currency_code); // get currency
                    const transData = {
                        currency,
                        fee: null,
                        amount: creditAmount,
                        total_amount: creditAmount,
                        user_id: member.id,
                        tx_type: 'credit',
                        subtype: 'product',
                        status: 'Completed',
                        note: `${title}: ${status}`,
                        reference: `Cancelled-${product_code}`,
                        source_transaction: user_product_id,
                        metadata: fees,
                    };
                    const transaction = await transactionService.create(transData);
                    const txid = getTxid(product_code, transaction.auto_id);
                    await transactionService.update({ txid }, transaction.id);
                    transaction.txid = txid;

                    // deduct funds from user wallet
                    await accountService.update({
                        balance: parseFloat(wallet.balance) + creditAmount,
                        available_balance: parseFloat(wallet.available_balance) + creditAmount,
                        updated: sequelize.fn('NOW'),
                    }, wallet.id);
                }
            }

            // log activity log
            await activityService.addActivity({
                user_id: req.user.id,
                action: `${req.user.group_name}.products.cancel.${action}`,
                description: `${req.user.first_name} updated product cancellation request (${status}: ${product.title})`,
                section: 'Products',
                subsection: 'Cancellation Requests',
                ip: null,
                data: {
                    ...req.body,
                    ...req.params,
                },
            });

            // send email to member
            await cancellationConfirmation({
                action,
                product,
                email: member.email,
                first_name: member.first_name,
            });

            return res.send({ success: true });
        }
        return res.send({ success: false });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    createCategory,
    create,
    index,
    history,
    show,
    update,
    destroy,
    categories,
    getMembersByProductId,
    categories,
    updateCategory,
    showCategory,
    getSubcategories,
    showSubcategory,
    subcategoryCalculations,
    processPayouts,
    captureCalculations,
    updateSubcategory,
    cancelStatus,
    cancelStatus,
    cancellations,
    cancellationsAction,
};