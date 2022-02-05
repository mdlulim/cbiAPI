const kycService = require('../services/KYC');
const { kycNotification } = require('../helpers/emailHandler');
const activityService = require('../services/Activity');

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

async function pending(req, res) {
    try {
        const data = await kycService.pending();
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

async function all(req, res) {
    try {
        const data = await kycService.all();
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
        const updated = await kycService.update(data.levels)

        // log activity log
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.kyc.update`,
            description: `${req.user.first_name} updated user kyc application`,
            section: 'KYC',
            ip: null,
            data,
        });


        const kyc_applications = await kycService.show(data.user_id);
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
            level:calculate_kyc_level(kyc_applications),
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

function calculate_kyc_level (kyc_applications) {
    let least_rejected = 10;
    let total_verified = 0;

    kyc_applications.forEach(row=>{
        if((parseInt(row.level) < least_rejected && row.status === 'Rejected') || (parseInt(row.level) < least_rejected && row.status === 'Pending'))
            least_rejected = parseInt(row.level)
        if(row.verified)
            total_verified += 1;
    })

    const kyc_level = (least_rejected === 10 && total_verified === 4) ? 3 : (least_rejected === 0 || total_verified === 0) ? -1 : least_rejected - 1
    return kyc_level
}

async function kyc_level(req, res) {
    try {
        const kyc_applications = await kycService.show(req.params.id);
        
        return res.send({
            success: true,
            data:{ kyc_level: calculate_kyc_level(kyc_applications) },
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
    kyc_level,
    pending,
    all
};