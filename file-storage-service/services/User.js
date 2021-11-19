const sequelize = require('../config/db');
const { User } = require('../models/User');

async function update(data, id) {
    try {
        return User.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    update,
}
