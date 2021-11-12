const { Activity } = require('../models/Activity');
const { User } = require('../models/User');

Activity.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function add(data) {
    try {
        return Activity.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function getByUser(user_id) {
    try {
        return Activity.findAll({
            where: { user_id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    add,
    getByUser,
};
