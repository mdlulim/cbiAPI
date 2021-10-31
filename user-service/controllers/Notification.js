const notificationService = require('../services/Notification');
const activityService = require('../services/Activity');

async function index(req, res) {
    try {
        const accounts = await notificationService.index(req.user.id);
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
        return notificationService.update(req.params.id, req.body)
        .then(async () => {
            await activityService.add({
                user_id: req.user.id,
                action: `${req.user.group_name.toLowerCase()}.notifications.update`,
                description: `${req.user.first_name} updated notifications`,
                section: 'Profile',
                subsection: 'Notifications',
                data: { id: req.params.id, data: req.body },
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
    index,
    update,
};
