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
};

module.exports = {
    index,
}