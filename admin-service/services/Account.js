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

async function mainaccount() {
    try {
        return Account.findOne({
            where: {
                id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'
            },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    wallet,
    mainaccount
}
