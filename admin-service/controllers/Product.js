const productService = require('../services/Product');
const activityService = require('../services/Activity');

function permakey(title) {
    return title.split(' ')
        .join('-')
        .trim()
        .toLowerCase();
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
        return res.send({
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
        return res.send({
            success: false,
            message: 'Could not process request'
        });
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

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
};