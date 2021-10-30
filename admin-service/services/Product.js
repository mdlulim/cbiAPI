const sequelize = require('../config/db');
const { Currency } = require('../models/Currency');
const { Product } = require('../models/Product');

Product.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });

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
            include: [{ model: Currency }],
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id) {
    try {
        return Product.findOne({
            where: { id },
            include: [{ model: Currency }],
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
}
