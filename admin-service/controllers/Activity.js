const activityService = require('../services/Activity');

async function index(req, res) {
    try {
        const activites = await activityService.index();
        const { count, rows } = activites;
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}
async function getActivitiesByUser(req, res) {
    try {
        const activities = await activityService.getActivitiesByUser(req.params.id);
        const { count, rows } = activities.data;
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: activities.data.results,
            }
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
    getActivitiesByUser,
};