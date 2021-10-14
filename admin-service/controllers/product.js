const sequelize = require('../config/db');
const productService = require('../services/product');

function create(req, res){
    const data = req.body;
    data.user_id = req.user.id;
    return productService.create(data)
    .then(() => res.send({ success: true }))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function index(req, res){
    return productService.index(req.user.id, req.query)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function show(req, res){
    return productService.show(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function update(req, res){
    const data = req.body;
    if (data) data.updated = sequelize.fn('NOW');
    productService.update(req.params.id, data)
    .then(() => res.send({ success: true }))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function destroy(req, res){
    productService.destroy(req.params.id)
    .then(() => res.send({ success: true }))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
};
