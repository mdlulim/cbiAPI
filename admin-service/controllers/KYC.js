const kycService = require('../services/KYC');
const { kycNotification } = require('../helpers/emailHandler');

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
        // array.forEach(element => {
        //     const updated = await kycService.update(req.body, req.params.id);
        // });

        const notified = await kycNotification({
            first_name:"Palema",
            remaining:"id card",
            level:"2",
            email: "abpalema@gmail.com"   
        })

        return res.send({
            success: true,
            // updated,
            notified
        });


    } catch (error) {
        console.log(error);
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    create,
    show,
    update,
};