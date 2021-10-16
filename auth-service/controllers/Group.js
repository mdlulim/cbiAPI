const userRoleService = require('../services/userRole');

function addRole(req, res) {
    return userRoleService.addRole(req.body)
    .then(() => res.send({ success: true }))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

function getUserRoles(req, res){
    userRoleService.getUserRoles(req.query || {})
    .then((data) => {
        return res.send(data);
    });
};

function getUserRole(req, res){
    userRoleService.getUserRole(req.params.id)
    .then(data => res.send(data));
};

module.exports = {
    addRole,
    getUserRoles,
    getUserRole,
};
