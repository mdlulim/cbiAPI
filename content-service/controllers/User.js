const userService = require('../services/User');

async function create(req, res){
    return userService.create(req.body)
    .then(() => res.send({ success: true }))
    .catch(err => {
        res.send({
            success: false,
            message: err.message,
        });
    });
};

async function index(req, res){
    return userService.index(req.query)
    .then(data => res.send(data))
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
};
