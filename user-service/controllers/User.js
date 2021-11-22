const activityService = require('../services/Activity');
const kycService = require('../services/KYC');
const userService = require('../services/User');
const emailHandler = require('../helpers/emailHandler');

async function profile(req, res) {
    try {
        const user = await userService.show(req.user.id);
        return res.send({
            success: true,
            data: user,
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function referrals(req, res) {
    try {
        const referrals = await userService.referrals(req.user.id);
        return res.send({
            success: true,
            data: {
                count: (referrals && referrals.length) || 0,
                results: referrals,
            },
        });
    } catch (error) {
        console.log(error.message);
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function referralsByUUID(req, res) {
    try {
        const referrals = await userService.referralsByUUID(req.params.uuid);
        return res.send({
            success: true,
            data: {
                count: (referrals && referrals.length) || 0,
                results: referrals,
            },
        });
    } catch (error) {
        console.log(error.message);
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function coaches(req, res) {
    try {
        const user = await userService.show(req.user.id);
        const firstLevelCoach = await userService.show(user.sponsor);
        const secondLevelCoach = await userService.show(firstLevelCoach.sponsor);
        return res.send({
            success: true,
            data: {
                first: firstLevelCoach,
                second: secondLevelCoach
            },
        });
    } catch (error) {
        console.log(error.message);
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function update(req, res) {
    try {
        return userService.update(req.user.id, req.body)
            .then(async () => {
                await activityService.add({
                    user_id: req.user.id,
                    action: `${req.user.group_name.toLowerCase()}.profile.update`,
                    description: `${req.user.first_name} updated profile`,
                    section: 'Account',
                    subsection: 'Profile',
                    data: { id: req.user.id, data: req.body },
                    ip: null,
                });
                return res.send({ success: true });
            })
            .catch(err => {
                res.send({
                    success: false,
                    message: err.message,
                });
            });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function kyc(req, res) {
    try {
        const data = await kycService.index(req.params.id);
        const { count, rows } = data;
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
            message: error
        });
    }
}

async function captureKYC(req, res) {
    try {
        await kycService.capture(req.body);
        await activityService.add({
            user_id: req.user.id,
            action: `${req.user.group_name.toLowerCase()}.kyc.capture`,
            description: `${req.user.first_name} captured kyc information`,
            section: 'Account',
            subsection: 'KYC',
            data: { id: req.user.id, data: req.body },
            ip: null,
        });

        /**
         * @TODO : send email to member
         */
        return res.send({ success: true });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request' + error.message
        });
    }
}

async function kyc_level(req, res) {
    try {
        const kyc_applications = await kycService.allkyc(req.params.id);
        let least_rejected = 10;
        let total_verified = 0;

        kyc_applications.forEach(row=>{
            if((parseInt(row.level) < least_rejected && row.status === 'Rejected') || (parseInt(row.level) < least_rejected && row.status === 'Pending'))
                least_rejected = parseInt(row.level)
            if(row.verified)
                total_verified += 1;
        })

        const kyc_level = (least_rejected === 10 && total_verified === 4) ? 3 : (least_rejected === 0 || total_verified === 0) ? -1 : least_rejected - 1

        return res.send({
            success: true,
            data:{ kyc_level },
        });
    } catch (error) {
        return res.send({
            success: false,
            message: error
        });
    }
}

async function autorenew(req, res) {
    try {
        const data = req.body;

        // fetch user record
        const user = await userService.show(req.user.id);

        // update user record
        await userService.update(req.user.id, data);

        // activity log
        await activityService.add({
            user_id: req.user.id,
            action: `${req.user.group_name.toLowerCase()}.account_wc-autorenew.update`,
            description: `${req.user.first_name} switched autorenew status to ${data.autorenew ? 'on' : 'off'}`,
            section: 'Account',
            subsection: 'Wealth Creator - Auto Renewal Status Update',
            data: { id: req.user.id, data: req.body },
            ip: null,
        });

        // send email notification for AUTO-RENEW
        await emailHandler.autoRenewStatusChange({
            email: user.email,
            first_name: req.user.first_name,
            status: data.autorenew ? 'ON' : 'OFF',
        });

        // return response
        return res.send({ success: true });

    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function search(req, res) {
    try {
        const users = await userService.search(req.params.prop, req.params.value);
        const { count, rows } = users;
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

async function activities(req, res) {
    try {
        const activities = await userService.activities(req.user, req.query);
        const { count, rows } = activities;
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

module.exports = {
    profile,
    referrals,
    referralsByUUID,
    coaches,
    update,
    kyc,
    captureKYC,
    autorenew,
    search,
    activities,
    kyc_level
};
