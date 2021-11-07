const settingService = require('../services/Setting');

async function index(req, res){
    try {
        const configuration = await settingService.config(req.query);
        var data = {};

        if (configuration && configuration.length > 0) {
            configuration.map(item => {
                const { key, value } = item;
                data[key] = value;
            });
        }

        return res.send({
            success: true,
            data,
        });
    } catch (error) {
        console.log(error);
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
};

module.exports = {
    index,
}