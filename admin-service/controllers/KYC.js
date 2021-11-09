const kycService = require('../services/KYC');

async function create(req, res) {
    try {
        const data = {
            ...req.body,
            user_id: req.params.id,
        };
        await kycService.create(data);

        /**
         * @TODO : 
         *  - log the activity
         *  - send email to member
         */

        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function show(req, res) {
    try {
        const data = await kycService.show(req.params.id);
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
}

async function update(req, res) {
    try {
        const updated = await kycService.update(req.body, req.params.id);
        return res.send({
            success: true,
            updated,
            
        });
    } catch (error) {
        console.log(error);
        return res.send({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    create,
    show,
    update,
};