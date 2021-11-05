const activityService = require('../services/Activity');
const productService  = require('../services/Product');

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
        const product = await productService.show(req.body.id);
        if (!product.id) {
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
        await productService.subscribe(data);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.buy`,
            description: `${req.user.first_name} bought a product (${product.title})`,
            section: 'Products',
            subsection: 'Buy',
            ip: null,
            data: {
                ...data,
                product,
            },
        });
        return res.send({
            success: true,
        });
    } catch (err) {
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