const sequelize = require('../config/db');
const { Currency } = require('../models/Currency');
const { Product } = require('../models/Product');
const { ProductCategory } = require('../models/ProductCategory');
const { UserProduct } = require('../models/UserProduct');
const User = require('../models/User');

Product.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });
Product.belongsTo(ProductCategory, { foreignKey: 'category_id', targetKey: 'id' });

async function createCategory(data) {
    try {
        return ProductCategory.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function create(data) {
    try {
        return Product.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function index(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};

        delete where.offset;
        delete where.limit;

        return Product.findAndCountAll({
            where,
            include: [{ model: Currency }, { model: ProductCategory }],
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function categories(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};

        delete where.offset;
        delete where.limit;

        return ProductCategory.findAndCountAll({
            where,
            order: [['title', 'ASC']],
            offset: offset || 0,
            limit: limit || 100,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function getMembersByProductId(product_id) {
    try {

        return sequelize.query("SELECT * FROM users ur JOIN user_products up ON ur.id = up.user_id  WHERE up.product_id ='"+product_id+"'"
                );

    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id) {
    try {
        return Product.findOne({
            where: { id },
            include: [{ model: Product }, { model: ProductCategory }],
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
            include: [{ model: Currency }, { model: ProductCategory }],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * 
 * Update Product
 * 
 * Update company’s product details.
 * 
 * @param {string} id
 * @param {string} data 
 * @returns 
 */
async function update(id, data) {
    try {
        return Product.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroy(id) {
    try {
        return Product.destroy(id);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
    findByPermakey,
    categories,
    createCategory,
    getMembersByProductId,
}
