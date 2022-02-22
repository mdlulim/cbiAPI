const countryService = require('../services/Country');

async function index(req, res){
    try {
        const countries = await countryService.index();
        const { count, rows } = countries;
        return res.send({
            success: true,
            data: {
                count,
                results: rows,
            },
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function blacklist(req, res){
    try {
        return countryService.blacklist(req.params.id)
        .then(() => res.send({ success: true }));
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function unblacklist(req, res){
    try {
        return countryService.unblacklist(req.params.id)
        .then(() => res.send({ success: true }));
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    index,
    blacklist,
    unblacklist,
}