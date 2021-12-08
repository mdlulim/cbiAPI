const sequelize = require('../config/db');
const { Commission } = require('../models/Commission');

async function create(data) {
    try {
        data.commission_date = sequelize.fn('NOW');
        return Commission.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
}
