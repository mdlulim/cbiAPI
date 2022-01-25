const groupService = require('../services/Group');

function create(req, res){
    return groupService.create(req.body, req.user)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function index(req, res){
    return groupService.index(req.query)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function get(req, res){
    return groupService.get(req.user.id)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function show(req, res){
    return groupService.show(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function update(req, res){
    return groupService.update(req.params.id, req.body)

    .then(data => res.send(data))
    .catch(err => {
        console.log(err.message)
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function destroy(req, res){
    return groupService.destroy(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};


async function archive(req, res) {
    try {
        return groupService.archive(req.params.id)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
};

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
    archive,
    get,
};
