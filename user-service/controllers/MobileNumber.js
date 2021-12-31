const activityService = require('../services/Activity');
const mobileNumberService = require('../services/MobileNumber');

async function create(req, res) {
    try {
        return mobileNumberService.create(req.body)
        .then(() => res.send({ success: true }))
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

async function index(req, res) {
    try {
        const mobiles = await mobileNumberService.index(req.user.id);
        const { count, rows } = mobiles;
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

async function show(req, res) {
    try {
        const mobile = await mobileNumberService.show(req.params.id);
        return res.send({
            success: true,
            data: mobile,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function update(req, res) {
    try {
        const { number } = req.body;
        const mobile = await mobileNumberService.findByNumber(number);
        if (mobile && mobile.id) {
            return res.status(403).send({
                success: false,
                message: 'Mobile number already exists, please try a different number.'
            });
        }
        return mobileNumberService.update(req, req.body)
        .then(async () => {
            await activityService.add({
                user_id: req.user.id,
                action: `${req.user.group_name.toLowerCase()}.profile.update`,
                description: `${req.user.first_name} updated mobile number`,
                section: 'Profile',
                subsection: 'Settings > 2FA',
                data: { id: req.user.id, data: req.body },
                ip: null,
            });
            return res.send({ success: true });
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function destroy(req, res) {
    try {
        return mobileNumberService.destroy(req.params.id)
        .then(() => res.send({ success: true }))
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

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
};
