const sequelize = require('../config/db');
const { EmailAddress } = require('../models/EmailAddress');
const { User } = require('../models/User');

EmailAddress.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        return EmailAddress.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
}
