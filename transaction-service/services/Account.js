const sequelize = require('../config/db');
const { Account } = require('../models/Account');

async function wallet(user_id) {
    try {
        return Account.findOne({
            where: { user_id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(data, id) {
    try {
        data.updated = sequelize.fn('NOW');
        return Account.update(data, {
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    wallet,
    update,
}
