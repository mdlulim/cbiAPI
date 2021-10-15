const userService = require('../services/user');

function index(req, res){
    try {
        return userService.index(req.query)
        .then(data => res.send(data))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

module.exports = {
    index,
};
