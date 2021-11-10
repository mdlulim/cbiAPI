const sequelize = require('../config/db');
const { Currency }  = require('../models/Currency');
const { Investment }  = require('../models/Investment');
const { Product }  = require('../models/Product');
const { User }  = require('../models/User');

Investment.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });
Investment.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id' });
Investment.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        return Investment.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
}
