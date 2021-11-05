const activityService = require('../services/Activity');
const productService  = require('../services/Product');
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

module.exports = {
    index,
    overview,
    subscribe,
    show,
};