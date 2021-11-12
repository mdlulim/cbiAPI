const sequelize = require('../config/db');
const { MobileNumber } = require('../models/MobileNumber');
const { User } = require('../models/User');

MobileNumber.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        return MobileNumber.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
}
