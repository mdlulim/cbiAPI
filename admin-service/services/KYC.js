// const sequelize = require('../config/db');
const { User } = require('../models/User');
const { KYC } = require('../models/KYC');

KYC.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function show(id) {
    try {
        return KYC.findOne({
            where: {
                user_id: id
            }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    show,
}
