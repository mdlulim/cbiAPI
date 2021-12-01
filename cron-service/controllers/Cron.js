const cronService = require('../services/Cron');

async function autorenew(req, res){
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
};

async function index(req, res){
    try {
        const cronjobs = await cronService.index(req.query);
        return res.send({
            success: true,
            data: cronjobs,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
};

module.exports = {
    autorenew,
    index,
}