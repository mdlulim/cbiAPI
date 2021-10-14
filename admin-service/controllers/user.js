const userService = require('../services/user');

function index(req, res){
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
    index,
};
