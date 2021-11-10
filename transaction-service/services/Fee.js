// const sequelize = require('../config/db');
const { Currency } = require('../models/Currency');
const { Fee }  = require('../models/Fee');

Fee.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });

async function show(tx_type, subtype) {
    try {
        return Fee.findOne({
            where: {
                tx_type,
                subtype,
                archived: false,
            },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    show,
};
