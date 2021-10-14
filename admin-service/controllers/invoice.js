const sequelize = require('../config/db');
const invoiceService = require('../services/invoice');

function create(req, res){
    const data = req.body;
    data.user_id = req.user.id;
    return invoiceService.create(data)
    .then(() => res.send({ success: true }))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function index(req, res){
    return invoiceService.index(req.user.id, req.query)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function show(req, res){
    return invoiceService.show(req.params.uuid)
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
    invoiceService.update(req.params.uuid, data)
    .then(() => res.send({ success: true }))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function destroy(req, res){
    invoiceService.destroy(req.params.uuid)
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
