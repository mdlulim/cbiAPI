const sequelize = require('../config/db');
const { Currency } = require('../models/Currency');

async function create(data) {
    try {
        return Currency.create(data);
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

        return Currency.findAndCountAll({
            where,
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

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

/**
 * 
 * Update Currency
 * 
 * Update company’s currency details.
 * 
 * @param {string} code
 * @param {string} data 
 * @returns 
 */
async function update(code, data) {
    try {
        return Currency.update(data, { where: { code } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroy(code) {
    try {
        return Currency.destroy(code);
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
