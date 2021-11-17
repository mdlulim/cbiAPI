const sequelize = require('../config/db');
const { Document } = require('../models/Document');
const { User } = require('../models/User');

Document.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        return Document.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
}
