const sequelize = require('../config/db');
const { UserProduct }  = require('../models/UserProduct');
const { User }  = require('../models/User');

UserProduct.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function tokens(user_id) {
    try {
        const tokens = await UserProduct.sum('tokens', {
            where: { user_id },
        });
        return tokens;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    tokens,
}
