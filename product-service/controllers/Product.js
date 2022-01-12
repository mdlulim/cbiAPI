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
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function index(req, res){
    try {
        return productService.index(req.user.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function subscribe(req, res){
    try {
        // get product details
        const product = await productService.findByCode(req.body.product_code);
        const { product_subcategory } = product;
        const { code } = product_subcategory;

        // get user
        const user = await userService.show(req.user.id);

        // product check
        const isWC    = config.products.WC === code;
        const isFP    = config.products.FP === code;
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
            user_id: user.id,
            product_id: product.id,
        };

        if (isCBIx7) {
            // tokens
            if (req.body.tokens) {
                data.tokens = req.body.tokens;
            }
        }

        // wealth creator
        if (isWC) {
            data.end_date = moment().add(1, 'month').format('YYYY-MM-DD');
        }

        // subscribe
        const userProduct = await productService.subscribe(data);

        let description = `${user.first_name} bought a product (${product.title})`;
        if (isWC) {
            description = `${user.first_name} became a Wealth Creator`;
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
            var adminFee = parseFloat(product.registration_fee);
            var price = parseFloat(product.price);
            var amount = adminFee + price;

            // update wallet balance
            await accountService.update({
                balance: parseFloat(wallet.balance) - amount,
                available_balance: parseFloat(wallet.available_balance) - amount,
            }, wallet.id);

            // update profile
            await userService.update(user.id, {
                group_id: 'c85ef2f9-d1dc-451d-b36d-9f0b111c1882',
                expiry: moment().add(1, 'month').format('YYYY-MM-DD'),
                autorenew: true,
            });

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
                metadata: {
                    entity: 'user_products',
                    refid: userProduct.id,
                }
            });

            // update transaction
            var txid = product.product_code + transaction.auto_id;
            await transactionService.update({ txid }, transaction.id);

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
                metadata: {
                    entity: 'user_products',
                    refid: userProduct.id,
                    tokens: data.tokens,
                }
            });

            // update transaction
            var txid = product.product_code + transaction.auto_id;
            await transactionService.update({ txid }, transaction.id);
            
            // send token purchase confirmation email
            await tokenPurchaseConfirmation({
                product,
                email: user.email,
                tokens: req.body.tokens,
                amount: req.body.amount,
                first_name: user.first_name,
            });
        }
        
        // Fraxions
        if (isFX) {
            var feeAmount = 0;
            if (Object.keys(product.fees).length > 0) {
                Object.keys(product.fees).map(key => {
                    feeAmount += parseFloat(product.fees[key]);
                });
            }
            var totalAmount = parseFloat(product.price) + feeAmount;

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
                    metadata: {
                        entity: 'user_products',
                        refid: userProduct.id,
                    }
                });
    
                // update transaction
                var txid = product.product_code + transaction.auto_id;
                await transactionService.update({ txid }, transaction.id);
            
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
        const userProduct = await productService.userProduct(user.id, product.id);

        // validate token balance
        if (parseFloat(userProduct.tokens) < parseFloat(tokens)) {
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
            tokens: parseFloat(userProduct.tokens) - parseFloat(tokens),
            status: 'Active',
        }, userProduct.id);

        // insert transaction
        var transaction = await transactionService.create({
            tx_type: 'credit',
            subtype: 'product',
            user_id: user.id,
            fee: 0,
            amount: calculations.amount,
            reference: `${product.product_code}-Sell`,
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
                refid: userProduct.id,
                entity: 'user_products',
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

        const metadata = {
            investment_period,
            minimum_investment,
            daily_interest,
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
        };

        // create investment and log product
        const response = await investmentService.create(investment);

        if (response) {
            // log user product record
            await productService.subscribe({
                end_date: moment().add(investment_period, 'months').format('YYYY-MM-DD'),
                user_id: user.id,
                product_id: id,
            });

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
            const txid = getTxid(product_code, transaction.auto_id);
            await transactionService.update({ txid }, transaction.id);
            transaction.txid = txid;
            
            // deduct funds from user wallet
            await transactionService.debit({
                balance: parseFloat(balance) - totalAmount,
                available_balance: parseFloat(available_balance) - totalAmount,
                updated: sequelize.fn('NOW'),
            }, wallet.id)
    
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
        }
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
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
        const earnings = await commissionService.index(id, data.id);
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
        return res.status(200).send({
            success: true,
            data: {
                count: null,
                next: null,
                previous: null,
                results: transactions,
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