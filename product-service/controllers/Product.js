const moment = require('moment');
const sequelize = require('../config/db');
const activityService = require('../services/Activity');
const investmentService  = require('../services/Investment');
const productService  = require('../services/Product');
const transactionService  = require('../services/Transaction');
const userService = require('../services/User');

async function overview(req, res){
    try {
        return productService.overview()
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
        const product = req.body;

        // validate product
        if (!product || !product.id) {
            return res.status(403)
            .send({
                success: false,
                message: 'Failed to process request.'
            });
        }

        const data = {
            user_id: req.user.id,
            product_id: req.body.id,
        };

        // subscribe
        await productService.subscribe(data);

        let description = `${req.user.first_name} bought a product (${req.body.title})`;
        if (req.body.wc) {
            description = `${req.user.first_name} became a Wealth Creator`;
        }

        // log activity
        await activityService.addActivity({
            user_id: req.user.id,
            action: req.body.wc ? 'wealth-creator.subscribe' : `${req.user.group_name}.products.buy`,
            section: 'Products',
            subsection: 'Buy',
            description,
            ip: null,
            data,
        });

        // update user group (if wealth-creator subscription)
        if (req.body.wc) {
            await userService.update(req.user.id, {
                group_id: 'c85ef2f9-d1dc-451d-b36d-9f0b111c1882',
            });
        }

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

async function invest(req, res){
    try {

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

        const {
            amount,
        } = req.body;

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
            user_id: req.user.id,
            product_id: id,
            daily_interest,
            invested_amount: amount,
            currency_code,
            end_date: moment().add(investment_period, 'weeks').format('YYYY-MM-DD'),
        };

        // create investment and log product
        const response = await investmentService.create(data);
        await productService.subscribe({
            ...req.body,
            user_id: req.user.id,
            product_id: id,
        });

        if (response) {
            // retrive user wallet
            const wallet = await transactionService.wallet(req.user.id);
            const {
                balance,
                available_balance,
            } = wallet;
            
            // deduct funds from user wallet
            await transactionService.debit({
                balance: balance - amount,
                available_balance: available_balance - amount,
                updated: sequelize.fn('NOW'),
            }, wallet.id)
    
            // log activities
            await activityService.addActivity({
                user_id: req.user.id,
                action: `${req.user.group_name}.account.debit`,
                section: 'Account',
                subsection: 'Debit',
                description: `${amount} ${currency_code} debited from wallet for ${title}`,
                ip: null,
                data,
            });

            let description = `${req.user.first_name} invested in a product (${title})`;

            await activityService.addActivity({
                user_id: req.user.id,
                action: `${req.user.group_name}.products.invest`,
                section: 'Products',
                subsection: 'Invest',
                description,
                ip: null,
                data,
            });

            // send confirmation email
    
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

module.exports = {
    index,
    overview,
    subscribe,
    show,
    products,
    categories,
    invest,
};