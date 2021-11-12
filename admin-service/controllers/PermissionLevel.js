const permissionService = require('../services/PermissionLevel');

function create(req, res){
    return permissionService.create(req.body)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function index(req, res){
    // console.log(req.query);
    return permissionService.index(req.query)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function show(req, res){
    return permissionService.show(req.params.id)
    .then(data => res.send(data))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function update(req, res){
    return permissionService.update(req.params.id, req.body)

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
    return permissionService.destroy(req.params.id)
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
        return permissionService.archive(req.params.id)
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
