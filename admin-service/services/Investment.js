const sequelize = require('../config/db');
const { Currency }  = require('../models/Currency');
const { Investment }  = require('../models/Investment');
const { Product }  = require('../models/Product');
const { User }  = require('../models/User');

Investment.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });
Investment.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id' });
Investment.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function show(where) {
    try {
        return Investment.findOne({ where });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(id, data) {
    try {
        data.last_updated = sequelize.fn('NOW');
        return Investment.findOne(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    show,
    update,
}
