const sequelize = require('../config/db');
const { Account }  = require('../models/Account');
const { Currency } = require('../models/Currency');
const { User }  = require('../models/User');

Account.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
Account.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });

async function show(id) {
    try {
        return Account.findOne({
            where: { user_id: id },
            include: [{
                model: Currency
            }]
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
            where: { id }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    show,
    update,
}