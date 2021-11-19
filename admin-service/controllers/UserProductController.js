const userProductService = require('../services/UserProduct')

async function index(req, res){
    try {
        return userProductService.index()
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

module.exports = {
    index
}