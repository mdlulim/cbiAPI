const sequelize = require('../config/db');
const { Account }  = require('../models/Account');
const { Currency }  = require('../models/Currency');
const { Product }  = require('../models/Product');
const { ProductCategory }  = require('../models/ProductCategory');
const { ProductSubCategory }  = require('../models/ProductSubCategory');
const { UserProduct }  = require('../models/UserProduct');
const { User }  = require('../models/User');

Account.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

Product.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'product_id' });
UserProduct.hasMany(Product, { foreignKey: 'id', targetKey: 'product_id' });

User.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'user_id' });
Product.belongsTo(ProductCategory, { foreignKey: 'category_id', targetKey: 'id' });

Product.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });

// MemberProduct.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
// User.hasMany(MemberProduct, { foreignKey: 'user_id', targetKey: 'id' });

// MemberProductLine.belongsTo(MemberProduct, { foreignKey: 'member_product_id', targetKey: 'id', as: 'product_lines' });
// MemberProduct.hasMany(MemberProductLine, { foreignKey: 'member_product_id', targetKey: 'id', as: 'product_lines' });

// MemberProductLine.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id' });

// MemberProduct.belongsTo(ProductSubCategory, { foreignKey: 'code', targetKey: 'code' });

Product.belongsTo(ProductSubCategory, { foreignKey: 'subcategory_id', targetKey: 'id' });
ProductSubCategory.hasMany(Product, { foreignKey: 'subcategory_id', targetKey: 'id' });

ProductSubCategory.belongsTo(ProductCategory, { foreignKey: 'category_id', targetKey: 'id' });
ProductCategory.hasMany(ProductSubCategory, { foreignKey: 'category_id', targetKey: 'id' });

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

async function findByPermakey(permakey) {
    try {
        return Product.findOne({
            where: { permakey },
            include: [{ model: Currency }, { model: ProductCategory }]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    findByCode,
    findByPermakey,
}
