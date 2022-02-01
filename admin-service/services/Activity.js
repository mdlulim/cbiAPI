const { Activity } = require('../models/Activity');
const { User } = require('../models/User');

Activity.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

// log new activity
async function addActivity(data) {
    try {
        return Activity.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

// get user activities
async function index() {
    try {
        const activities = await Activity.findAndCountAll({
            attributes: [
                'id',
                'action',
                'description',
                'data',
                'ip',
                'created',
            ],
            where,
            limit: 2,
            order: [['created', 'DESC']],
        });
        const { count, rows } = activities;
        return {
            status: "success",
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            },
        }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

// get user activities
async function getActivitiesByUser(userId) {
    try {
        const activities = await Activity.findAndCountAll({
            attributes: [
                'id',
                'action',
                'description',
                'data',
                'ip',
                'created',
            ],
            where: { user_id: userId },
            limit: 10,
            order: [['created', 'DESC']],
            include : [{
                attributes: [
                    'first_name',
                    'last_name',
                    'email',
                ],
                model: User,
                where: {
                    id: userId
                },}]
        });
        const { count, rows } = activities;
        return {
            status: "success",
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            },
        }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    index,
    addActivity,
    getActivitiesByUser,
};
