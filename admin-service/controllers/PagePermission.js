const pagePermissionService = require('../services/PagePermission');

function create(req, res){
    return pagePermissionService.create(req.body)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function index(req, resd){
    return pagePermissionService.index(req.query)
    .then(
        data => resd.send(data))
    .catch(err => {
        resd.send({
            success: false,
            message: err.message,
        });
    });
};

function show(req, res){
    return pagePermissionService.show(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function update(req, res){
    console.log(req.params.id);
    return pagePermissionService.update(req.params.id, req.body)

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
    return pagePermissionService.destroy(req.params.id)
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
        return pagePermissionService.archive(req.params.id)
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
};
