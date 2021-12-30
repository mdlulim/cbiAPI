const beneficiaryService = require('../services/Beneficiary');
const activityService = require('../services/Activity');
const userService = require('../services/User');
const emailHandler = require('../helpers/emailHandler');

async function create(req, res) {
    try {
        const data = req.body;
        data.user_id = req.user.id;
        return beneficiaryService.create(data)
        .then(async () => {
            await activityService.add({
                user_id: req.user.id,
                action: `${req.user.group_name.toLowerCase()}.beneficiaries.add`,
                description: `${req.user.first_name} added new beneficiary`,
                section: 'Profile',
                subsection: 'Beneficiaries',
                data: { data: req.body },
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

async function index(req, res) {
    try {
        const accounts = await beneficiaryService.index(req.user.id);
        const { count, rows } = accounts;
        return res.send({
            success: true,
            data: {
                count,
                results: rows,
            },
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function update(req, res) {
    try {
        await beneficiaryService.update(req.params.id, req.body);
        await activityService.add({
            user_id: req.user.id,
            action: `${req.user.group_name.toLowerCase()}.beneficiaries.update`,
            description: `${req.user.first_name} updated beneficiary`,
            data: { id: req.params.id, data: req.body },
            subsection: 'Beneficiaries',
            section: 'Profile',
            ip: null,
        });
        // send update email
        const user = await userService.show(req.user.id);
        const { email, first_name } = user;
        await emailHandler.updateNotification({
            subject: 'Beneficiary information updated',
            message: `Beneficiary details for ${req.body.first_name} ${req.body.last_name} have been successfully updated.`,
            first_name,
            email,
        });
        return res.send({ success: true });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function destroy(req, res) {
    try {
        const beneficiary = await beneficiaryService.show(req.params.id);
        await beneficiaryService.destroy(req.params.id);
        await activityService.add({
            user_id: req.user.id,
            action: `${req.user.group_name.toLowerCase()}.beneficiaries.delete`,
            description: `${req.user.first_name} delete beneficiary`,
            data: { id: req.params.id, data: JSON.stringify(beneficiary) },
            subsection: 'Beneficiaries',
            section: 'Profile',
            ip: null,
        });

        // send update email
        const user = await userService.show(req.user.id);
        const { email, first_name } = user;
        await emailHandler.updateNotification({
            subject: 'Beneficiary information deleted',
            message: `${beneficiary.first_name} ${beneficiary.last_name} has been successfully removed from your CBI beneficiaries.`,
            first_name,
            email,
        });
        return res.send({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    create,
    index,
    update,
    destroy,
};
