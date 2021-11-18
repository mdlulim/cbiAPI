const sequelize = require('../config/db');
const { Currency } = require('../models/Currency');
const { Fee }  = require('../models/Fee');

Fee.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });

async function show(tx_type, subtype, group_id) {
    try {
        const { Op } = sequelize;
        return Fee.findOne({
            where: {
                tx_type: { [Op.iLike]: tx_type },
                subtype: { [Op.iLike]: subtype },
                archived: false,
                group_id,
            },
            include: [{ model: Currency }]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    show,
};
