const axios = require('axios');
const moment = require('moment');
const sequelize = require('../config/db');
const config = require('../config');
const accountService = require('../services/Account');
const activityService = require('../services/Activity');
const commissionService  = require('../services/Commission');
const currencyService = require('../services/Currency');
const investmentService  = require('../services/Investment');
const productService  = require('../services/Product');
const settingService = require('../services/Setting');
const transactionService  = require('../services/Transaction');
const userService = require('../services/User');
const wealthCreatorService = require('../services/WealthCreator');
const {
    cbiX7SellConfirmation,
    tokenPurchaseConfirmation,
    wealthCreatorConfirmation,
    productPurchaseConfirmation,
    cancellationRequestConfirmation,
} = require('../helpers/emailHandler');
const { calculateSellCBIX7 } = require('../utils');

const getTxid = (prefix, autoid) => {
    return prefix.toUpperCase() + autoid.toString();
};

async function overview(req, res){
    try {
        return productService.overview(req.query)
        .then(data => res.send(data));
    } catch (err) {
        console.error(err.message || null);
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function index(req, res){
    try {
        const products = await productService.memberProducts(req.user.id);
        const { count, rows } = products;
        return res.status(200)
        .send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
        // return productService.index(req.user.id)
        // .then(data => res.send(data));
    } catch (err) {
        console.error(err.message || null);
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function subscribe(req, res){
    try {
        const { frequency } = req.body;

        // get product details
        const product = await productService.findByCode(req.body.product_code);
        const { product_subcategory } = product;
        const { code } = product_subcategory;

        // get user
        const user = await userService.show(req.user.id);

        // product check
        const isWC    = config.products.WC === code;
        const isFX    = config.products.FX === code;
        const isCBIx7 = config.products.CBIx7 === code;

        // validate product
        if (!product) {
            return res.status(403)
            .send({
                success: false,
                message: 'Failed to process request.'
            });
        }

        const data = {
            code,
            user_id: user.id,
            product_id: product.id,
        };

        // activity desciption
        let description = `${user.first_name} bought a product (${product.title})`;

        if (isCBIx7) {
            // tokens
            if (req.body.tokens) {
                data.value = parseFloat(req.body.tokens);
                data.entity = 'CBIx7';
            }
        }

        // wealth creator
        if (isWC) {
            description = `${user.first_name} became a Wealth Creator`;
            data.entity = 'Wealth Creator';
        }

        // fraxion product
        if (isFX) {
            data.end_date = moment().add(1000, 'days').format('YYYY-MM-DD');
            data.entity = 'Fraxions';
        }

        // log activity
        await activityService.addActivity({
            user_id: req.user.id,
            action: isWC ? 'wealth-creator.subscribe' : `${req.user.group_name}.products.buy`,
            section: 'Products',
            subsection: 'Buy',
            description,
            ip: null,
            data,
        });
            
        // get and update wallet balance
        const wallet = await accountService.show(user.id);

        // update user group (if wealth-creator subscription)
        if (isWC) {

            /// price/value calculations
            var adminFee = parseFloat(product.registration_fee);
            var price = parseFloat(product.price);
            var period = 1;

            // check frequency
            if (frequency && frequency.toUpperCase() === 'ANNUALLY') {
                // retrieve settings/configurations
                const settings = await settingService.findByKey('wc_renewal_annual_fee');
                if (settings & settings.value) {
                    period = 12;
                    adminFee = adminFee * period;
                    price = parseFloat(settings.value);
                }
            }
            var amount = adminFee + price;

            // insert transaction
            var transaction = await transactionService.create({
                tx_type: 'debit',
                subtype: 'product',
                user_id: user.id,
                fee: adminFee,
                amount: price,
                reference: `${product.product_code}-Subscription`,
                note: `Subscribed to ${product.title} product`,
                total_amount: amount,
                currency: product.currency,
                status: 'Completed',
            });

            // subscribe (add/update in user product table)
            data.value = price;
            data.transaction_id = transaction.id;
            data.end_date = moment().add(period, 'months').format('YYYY-MM-DD');
            var userProduct = await productService.subscribe(data);

            // update wallet balance
            await accountService.update({
                balance: parseFloat(wallet.balance) - amount,
                available_balance: parseFloat(wallet.available_balance) - amount,
            }, wallet.id);

            // update profile
            await userService.update(user.id, {
                group_id: 'c85ef2f9-d1dc-451d-b36d-9f0b111c1882',
                expiry: moment().add(period, 'month').format('YYYY-MM-DD'),
                autorenew: true,
            });

            // wealth creator insert
            await wealthCreatorService.create({
                user_id: user.id,
                product_id: product.id,
                frequency: frequency ? frequency.toUpperCase() : 'MONTHLY',
                fee_amount: price,
                last_payment_date: new Date().toISOString(),
                last_paid_amount: price,
                currency_code: product.currency.code,
                user_product_id: userProduct.id,
            });

            // update transaction
            var txid = product.product_code + transaction.auto_id;
            var metadata = {
                fees: product.fees,
                entity: 'member_products_lines',
                refid: userProduct.id,
                tokens: data.value,
                type: 'crypto',
                currency: 'CBI',
                currency_code: 'CBI',
            };
            await transactionService.update({ txid, metadata }, transaction.id);

            // send email
            await wealthCreatorConfirmation({
                first_name: user.first_name,
                email: user.email,
            });
        }
        
        // CBIx7
        if (isCBIx7) {

            // update wallet balance
            var totalAmount = parseFloat(req.body.amount);
            await accountService.update({
                balance: parseFloat(wallet.balance) - totalAmount,
                available_balance: parseFloat(wallet.available_balance) - totalAmount,
            }, wallet.id);

            // insert transaction
            var transaction = await transactionService.create({
                tx_type: 'debit',
                subtype: 'product',
                user_id: user.id,
                amount: totalAmount,
                reference: `Buy-${product.product_code}`,
                note: `Bought ${product.title}`,
                total_amount: totalAmount,
                currency: product.currency,
                status: 'Completed',
            });

            // subscribe (add/update in user product table)
            data.transaction_id = transaction.id;
            var userProduct = await productService.subscribe(data);

            // update transaction
            var txid = product.product_code + transaction.auto_id;
            var metadata = {
                fees: product.fees,
                entity: 'member_products_lines',
                refid: userProduct.id,
                tokens: data.value,
                type: 'crypto',
                currency: 'CBI',
                currency_code: 'CBI',
            };
            await transactionService.update({ txid, metadata }, transaction.id);
            
            // send token purchase confirmation email
            await tokenPurchaseConfirmation({
                product,
                email: user.email,
                tokens: req.body.tokens,
                amount: totalAmount,
                first_name: user.first_name,
            });
        }
        
        // Fraxions
        if (isFX) {
            var feeAmount = 0;
            if (Object.keys(product.fees).length > 0) {
                Object.keys(product.fees).map(key => {
                    if (key.includes('percentage')) {
                        feeAmount += parseFloat(product.fees[key] * product.price / 100);
                    } else {
                        feeAmount += parseFloat(product.fees[key]);
                    }
                });
            }
            var totalAmount = parseFloat(product.price) + feeAmount;

            // subscribe (add/update in user product table)
            // data.invested_amount = product.price;
            // var userProduct = await productService.subscribe(data);

            // balance check
            if (wallet.available_balance && parseFloat(wallet.available_balance) >= totalAmount) {

                // update wallet balance
                await accountService.update({
                    balance: parseFloat(wallet.balance) - totalAmount,
                    available_balance: parseFloat(wallet.available_balance) - totalAmount,
                }, wallet.id);

                // insert transaction
                var transaction = await transactionService.create({
                    tx_type: 'debit',
                    subtype: 'product',
                    user_id: user.id,
                    fee: feeAmount,
                    amount: parseFloat(product.price),
                    reference: `Buy-${product.product_code}`,
                    note: `Bought ${product.title}`,
                    total_amount: totalAmount,
                    currency: product.currency,
                    status: 'Completed',
                });

                // subscribe (add/update in user product table)
                data.value = product.price;
                data.transaction_id = transaction.id;
                var userProduct = await productService.subscribe(data);
    
                // update transaction
                var txid = product.product_code + transaction.auto_id;
                var metadata = {
                    fees: product.fees,
                    entity: 'member_products_lines',
                    refid: userProduct.id,
                    type: 'crypto',
                    currency: 'CBI',
                    currency_code: 'CBI',
                };
                await transactionService.update({ txid, metadata }, transaction.id);
            
                // send product purchase confirmation email
                await productPurchaseConfirmation({
                    product,
                    email: user.email,
                    amount: totalAmount,
                    first_name: user.first_name,
                });

            } else {
                return res.status(403)
                .send({
                    success: false,
                    message: 'Failed to process request. Insufficient balance!'
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

async function unsubscribe(req, res){
    try {
        const { id } = req.body;

        // retrieve user information
        const user = await userService.show(req.user.id);

        // retrieve product information
        const product = await productService.find(id, false);
        const { product_subcategory } = product;
        const { code } = product_subcategory;

        // product check
        const isWC    = config.products.WC === code;
        const isFP    = config.products.FP === code;
        const isFX    = config.products.FX === code;
        const isCBIx7 = config.products.CBIx7 === code;

        // sell CBIx7 tokens
        if (isCBIx7) {
            return sellCBIx7Tokens({
                user,
                product,
                ...req.body,
            }, res);
        }

        if (isWC || isFP || isFX) {
            return cancelProduct({
                user,
                product,
                ...req.body,
                isWC,
                isFP,
                isFX,
            }, res);
        }

        // response
        return res.send({ success: false });

    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function cancelProduct(data, res) {
    try {
        const {
            user,
            isWC,
            product,
        } = data;

        let description = `${user.first_name} logged cancellation request for a product (${product.title})`;
        if (isWC) {
            description = `${user.first_name} logged cancellation request for Wealth Creator subscription`;
        }

        // update user product
        await productService.update({
            user_id: user.id,
            status: 'Pending Cancellation',
            cancellation_status: 'Pending',
        }, product.id, false);

        // log activity
        await activityService.addActivity({
            user_id: user.id,
            action: isWC ? 'wealth-creator.cancel' : `${user.group.name}.products.cancel`,
            section: 'Products',
            subsection: 'Cancel',
            description,
            data: null,
            ip: null,
        });
            
        // send cancellation request confirmation email
        await cancellationRequestConfirmation({
            product,
            email: user.email,
            first_name: user.first_name,
        });

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

async function sellCBIx7Tokens(data, res) {
    try {
        const {
            user,
            tokens,
            product,
        } = data;
        const { exchange } = config;
        const { fees } = product;

        // fetch USD/ZAR rate
        const rate = await axios({
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

        // get user product
        const { product_subcategory } = product;
        const { code } = product_subcategory;
        const userProduct = await productService.userProduct(user.id, code);

        // validate token balance
        if (parseFloat(userProduct.value) < parseFloat(tokens)) {
            return res.status(403).send({
                success: false,
                message: 'Insufficient token balance available',
            });
        }

        // retrieve settings
        const configuration = await settingService.config();
        var settings = {};

        if (configuration && configuration.length > 0) {
            configuration.map(item => {
                const { key, value } = item;
                settings[key] = value;
            });
        }
        const {
            cbi_zar_value,
            bpt_value,
        } = settings;
        
        // calculate
        const calculations = calculateSellCBIX7({
            fees,
            usd: rate,
            bpt: bpt_value,  // BPT value - configurable attribute on the admin side
            exchangeRate: cbi_zar_value, // CBI to ZAR value - configurable attribute on the admin side
            tokenAmount: tokens, // The number of tokens the member/WC would like to sell at a point in time.
        });
            
        // get and update wallet balance
        const wallet = await accountService.show(user.id);

        // update wallet balance
        await accountService.update({
            balance: parseFloat(wallet.balance) + calculations.amount,
            available_balance: parseFloat(wallet.available_balance) + calculations.amount,
        }, wallet.id);

        // update user product
        await productService.update({
            value: parseFloat(userProduct.value) - parseFloat(tokens),
            status: 'Active',
        }, userProduct.id);

        // insert transaction
        var transaction = await transactionService.create({
            tx_type: 'credit',
            subtype: 'product',
            user_id: user.id,
            fee: 0,
            amount: calculations.amount,
            reference: `Sell-${product.product_code}`,
            note: `Sold to ${product.title} product`,
            total_amount: calculations.amount,
            source_transaction: userProduct.id,
            destination_transaction: wallet.id,
            currency: product.currency,
            status: 'Completed',
            metadata: {
                tokens,
                product,
                calculations,
                fees: product.fees,
                refid: userProduct.id,
                entity: 'member_products',
                type: 'crypto',
                currency: 'CBI',
                currency_code: 'CBI',

            },
        });

        // update transaction
        var txid = product.product_code + transaction.auto_id;
        await transactionService.update({ txid }, transaction.id);

        // log activity
        const description = `${user.first_name} sold a product (${product.title})`;
        await activityService.addActivity({
            user_id: user.id,
            action: `${user.group.name}.products.sell`,
            section: 'Products',
            subsection: 'Sell',
            description,
            ip: null,
            data: {
                tokens,
                product,
                calculations,
            },
        });
            
        // send token sell confirmation email
        await cbiX7SellConfirmation({
            tokens,
            product,
            email: user.email,
            amount: calculations.amount,
            first_name: user.first_name,
        });

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

async function invest(req, res){
    try {
        // get user
        const user = await userService.show(req.user.id);

        // validate product identifier
        if (!req.body.id) {
            return res.status(403)
            .send({
                success: false,
                message: 'Failed to process request.'
            });
        }

        // retrieve product by id
        const product = await productService.find(req.body.id, false);
        const { product_subcategory } = product;
        const { code } = product_subcategory;

        // amount
        const amount = parseFloat(req.body.amount);
        const totalAmount = parseFloat(req.body.total_amount);
        const {
            id,
            fees,
            title,
            currency_code,
            investment_period,
            minimum_investment,
            daily_interest,
            product_code,
        } = product;

        // retrive user wallet
        const wallet = await transactionService.wallet(user.id);
        const {
            balance,
            available_balance,
        } = wallet;

        // log transaction
        const currency = await currencyService.show(currency_code); // get currency
        const transData = {
            currency,
            fee: null,
            amount: amount,
            total_amount: totalAmount,
            user_id: user.id,
            tx_type: 'debit',
            subtype: 'product',
            status: 'Completed',
            note: `Bought ${title}`,
            reference: `Buy-${product_code}`,
            source_transaction: user.referral_id,
            metadata: fees,
        };
        const transaction = await transactionService.create(transData);
        
        // log user product record
        const userProduct = await productService.subscribe({
            code,
            value: amount,
            product_id: id,
            user_id: user.id,
            entity: 'Fixed Plans',
            transaction_id: transaction.id,
            end_date: moment().add(investment_period, 'months').format('YYYY-MM-DD'),
        });

        // create investment and log product
        const metadata = {
            fees,
            investment_period,
            minimum_investment,
            daily_interest,
            type: 'crypto',
            currency: 'CBI',
            currency_code: 'CBI',
            refid: userProduct.id,
            entity: 'member_products_lines',
        };
        const investment = {
            fees,
            metadata,
            user_id: user.id,
            product_id: id,
            daily_interest,
            invested_amount: amount,
            currency_code,
            end_date: moment().add(investment_period, 'weeks').format('YYYY-MM-DD'),
            accumulated_amount: amount,
            user_product_id: userProduct.id,
        };
        await investmentService.create(investment);

        const txid = getTxid(product_code, transaction.auto_id);
        await transactionService.update({ txid, metadata }, transaction.id);
        transaction.txid = txid;
        
        // deduct funds from user wallet
        await transactionService.debit({
            balance: parseFloat(balance) - totalAmount,
            available_balance: parseFloat(available_balance) - totalAmount,
            updated: sequelize.fn('NOW'),
        }, wallet.id);

        // log activities
        await activityService.addActivity({
            user_id: user.id,
            action: `${req.user.group_name}.account.debit`,
            section: 'Account',
            subsection: 'Debit',
            description: `${totalAmount} ${currency_code} debited from wallet for ${title}`,
            ip: null,
            data: investment,
        });

        let description = `${user.first_name} invested in a product (${title})`;

        await activityService.addActivity({
            user_id: user.id,
            action: `${req.user.group_name}.products.invest`,
            section: 'Products',
            subsection: 'Invest',
            description,
            ip: null,
            data: investment,
        });
        
        // send product purchase confirmation email
        await productPurchaseConfirmation({
            product,
            amount: totalAmount,
            email: user.email,
            first_name: user.first_name,
        });

        // send response
        return res.send({
            success: true,
        });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function show(req, res){
    try {
        return productService.show(req.params.permakey)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function earnings(req, res) {
    try {
        const { id } = req.user;
        const { permakey } = req.params;
        const { data } = await productService.show(permakey);
        let earnings = [];
        if (data && data.id) {
            earnings = await commissionService.index(id, data.id);
        }
        return res.send({
            success: true,
            data: {
                count: null,
                next: null,
                previous: null,
                results: earnings,
            }
        });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function products(req, res){
    try {
        const products = await productService.products(req.params.id);
        const { count, rows } = products;
        return res.status(200).send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function categories(req, res) {
    try {
        const categories = await productService.categories(req.query);
        const { count, rows } = categories;
        return res.status(200).send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function subcategories(req, res) {
    try {
        const subcategories = await productService.subcategories(req.query);
        const { count, rows } = subcategories;
        return res.status(200).send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function subcategory(req, res) {
    try {
        const subcategory = await productService.subcategory(req.params.permakey);
        return res.status(200).send({
            success: true,
            data: subcategory,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function category(req, res) {
    try {
        const category = await productService.category(req.params.permakey);
        return res.status(200).send({
            success: true,
            data: category,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function transactions(req, res){
    try {
        const { permakey } = req.params;
        const transactions = await productService.transactions(permakey, req.user.id);
        const { count, rows } = transactions;
        return res.status(200).send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function cancel(req, res){
    try {
        const { id } = req.params;
        const product = await productService.find(id, false);
        const data = {
            status: 'Cancelled',
            end_date: new Date().toISOString(),
        };
        return productService.update(data, id)
        .then(async () => {
    
            // log activities
            await activityService.addActivity({
                user_id: req.user.id,
                action: `${req.user.group_name}.product.cancel`,
                section: 'Product',
                subsection: 'Cancellation',
                description: `Cancellation request for ${product.title}`,
                ip: null,
                data,
            });

            return res.status(200).send({
                success: true,
            });
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

module.exports = {
    index,
    overview,
    subscribe,
    unsubscribe,
    show,
    earnings,
    products,
    categories,
    subcategories,
    subcategory,
    category,
    invest,
    transactions,
    cancel,
};