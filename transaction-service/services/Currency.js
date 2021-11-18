// const sequelize = require('../config/db');
const { Currency } = require('../models/Currency');

async function show(code) {
    try {
        return Currency.findOne({
            where: { code },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    show,
}
