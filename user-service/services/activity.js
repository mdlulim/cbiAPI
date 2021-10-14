const Activity = require('../models/activity').Activity;
const User = require('../models/user').User;

Activity.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

// log new activity
const addActivity = activity => Activity.create(activity);

// get user activities
const getActivitiesByUser = (userId) => Activity.findAll({
        attributes: [
            'id',
            'name',
            'description',
            'data',
            'ip',
            'created',
        ],
        where: { user_id: userId },
        order: [['created', 'DESC']],
    })
    .then(res => {
        return {
            status: "success",
            data: res,
        };
    });

module.exports = {
    addActivity,
    getActivitiesByUser,
};
