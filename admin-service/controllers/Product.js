const productService = require('../services/Product');

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

module.exports = {
    index,
    show,
};