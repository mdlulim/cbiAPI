const moment = require('moment');
const sequelize = require('../config/db');
const config = require('../config');
const accountService = require('../services/Account');
const activityService = require('../services/Activity');
const investmentService  = require('../services/Investment');
const productService  = require('../services/Product');
const transactionService  = require('../services/Transaction');
const userService = require('../services/User');
const {
    tokenPurchaseConfirmation,
    wealthCreatorConfirmation,
    productPurchaseConfirmation,
} = require('../helpers/emailHandler');

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

        // get user
        const user = await userService.show(req.user.id);

        // product check
        const isWC    = config.products.WC === product.product_category.code;
        // const isFP    = config.products.FP === product.product_category.code;
        const isFX    = config.products.FX === product.product_category.code;
        const isCBIx7 = config.products.CBIx7 === product.product_category.code;

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

async function invest(req, res){
    try {
        // get user
        const user = await userService.show(req.user.id);

        // retrieve product by id
        const product = await productService.show(req.body.id);

        // validate product
        if (!req.body.id) {
            return res.status(403)
            .send({
                success: false,
                message: 'Failed to process request.'
            });
        }

        // amount
        const amount = parseFloat(req.body.amount);
        const {
            id,
            fees,
            title,
            currency_code,
            investment_period,
            minimum_investment,
            daily_interest,
        } = product;

        const metadata = {
            investment_period,
            minimum_investment,
            daily_interest,
        };

        const data = {
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
        const response = await investmentService.create(data);
        await productService.subscribe({
            ...req.body,
            user_id: user.id,
            product_id: id,
        });

        if (response) {
            // retrive user wallet
            const wallet = await transactionService.wallet(user.id);
            const {
                balance,
                available_balance,
            } = wallet;
            
            // deduct funds from user wallet
            await transactionService.debit({
                balance: parseFloat(balance) - amount,
                available_balance: parseFloat(available_balance) - amount,
                updated: sequelize.fn('NOW'),
            }, wallet.id)
    
            // log activities
            await activityService.addActivity({
                user_id: user.id,
                action: `${req.user.group_name}.account.debit`,
                section: 'Account',
                subsection: 'Debit',
                description: `${amount} ${currency_code} debited from wallet for ${title}`,
                ip: null,
                data,
            });

            let description = `${user.first_name} invested in a product (${title})`;

            await activityService.addActivity({
                user_id: user.id,
                action: `${req.user.group_name}.products.invest`,
                section: 'Products',
                subsection: 'Invest',
                description,
                ip: null,
                data,
            });
            
            // send product purchase confirmation email
            await productPurchaseConfirmation({
                product,
                amount: amount,
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

module.exports = {
    index,
    overview,
    subscribe,
    show,
    products,
    categories,
    invest,
    transactions,
};