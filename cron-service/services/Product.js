const sequelize = require('../config/db');
const { Account }  = require('../models/Account');
const { Currency }  = require('../models/Currency');
const { Product }  = require('../models/Product');
const { ProductCategory }  = require('../models/ProductCategory');
const { UserProduct }  = require('../models/UserProduct');
const { User }  = require('../models/User');

Account.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

Product.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'product_id' });
User.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'user_id' });
Product.belongsTo(ProductCategory, { foreignKey: 'category_id', targetKey: 'id' });

Product.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });

async function findByCode(product_code) {
    try {
        return Product.findOne({
            where: { product_code },
            include: [{ model: Currency }, { model: ProductCategory }]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    findByCode,
}
