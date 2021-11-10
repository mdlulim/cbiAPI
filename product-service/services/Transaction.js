const sequelize = require('../config/db');
const { Account }  = require('../models/Account');
const { User }  = require('../models/User');

Account.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function wallet(user_id) {
    try {
        return Account.findOne({
            where: {
                user_id,
                is_primary: true,
            }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function debit(data, id) {
    try {
        return Account.update(data, {
            where: { id }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    debit,
    wallet,
}
