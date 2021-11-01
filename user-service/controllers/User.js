const activityService = require('../services/Activity');
const userService = require('../services/User');

async function profile(req, res) {
    try {
        const user = await userService.show(req.user.id);
        return res.send({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function referrals(req, res) {
    try {
        const referrals = await userService.referrals(req.user.id);
        const { count, rows } = referrals;
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

module.exports = {
    profile,
    referrals,
    update,
};
