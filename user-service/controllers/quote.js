const sequelize = require('../config/db');
const quoteService = require('../services/quote');

function create(req, res){
    const data = req.body;
    data.user_id = req.user.id;
    return quoteService.create(data)
    .then(() => res.send({ success: true }))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function index(req, res){
    return quoteService.index(req.user.id, req.query)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function show(req, res){
    return quoteService.show(req.params.uuid)
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
    quoteService.update(req.params.uuid, data)
    .then(() => res.send({ success: true }))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function destroy(req, res){
    quoteService.destroy(req.params.uuid)
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
