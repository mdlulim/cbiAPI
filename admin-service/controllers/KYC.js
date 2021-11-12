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
        console.log("data after db")
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
        const data = req.body
        const levels_to_update = Object.keys(data.levels);
        let updated = null
        levels_to_update.forEach(async(i) => {
            const id = data.levels[i].id
            delete data.levels[i].id
            updated = await kycService.update(data.levels[i], id);
        });

        let rem = '<ul>';
        data.rejected_docs.forEach( item => {
            rem += `
                <li>${item}</li>    
            `;
        });

        rem += '</ul>'
        
        const notified = await kycNotification({
            first_name:data.last_name,
            remaining:rem,
            level:data.kyc,
            email: data.email   
        })

        return res.send({
            success: true,
            updated,
            notified
        });


    } catch (error) {
        console.log(error);
        return res.send({
            success: false,
            message: error
        });
    }
}


async function kyc_level(req, res) {
    try {
        const data = await kycService.show(req.id);
        // const { count, kyc_applications } = data;

        // const levels = Object.keys(kyc_applications);
        // let least_rejected = 10
        // levels.foreach((level) => {
        //     if (parseInt(level) < least_rejected && kyc_applications[level].status === 'Rejected') {
        //         least_rejected = level
        //     }
        // })
        // const kyc_level = (least_rejected === 10 && kyc_applications[3].status === 'Approved') ? 3 : (least_rejected === '0') ? -1 : levels[levels.indexOf(least_rejected) - 1]

        return res.send({
            success: true,
            data,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: error
        });
    }
}


module.exports = {
    create,
    show,
    update,
    kyc_level
};