const sequelize = require('../config/db');
const { Notification } = require('../models/Notification');

async function index(user_id) {
    try {
        return Notification.findAndCountAll({
            where: { user_id },
            order: [['activity', 'ASC']],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(id, data) {
    try {
        return Notification.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroy(id) {
    try {
        return Notification.destroy({ where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    index,
    update,
    destroy,
}
