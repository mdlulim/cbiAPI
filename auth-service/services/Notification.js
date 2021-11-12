const sequelize = require('../config/db');
const { Notification } = require('../models/Notification');
const { User } = require('../models/User');

Notification.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        return Notification.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
}
