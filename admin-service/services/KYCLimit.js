const sequelize = require('../config/db');
const { KYCLimit } = require('../models/KYCLimit');

async function create(data) {
    try {
        return KYCLimit.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function index(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};
        const userWhere = {};
        delete where.offset;
        delete where.limit;
        return KYCLimit.findAndCountAll({
            where,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id,) {
    try {
        return KYCLimit.findOne({
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * 
 * Update CompanyBankAccount
 * 
 * Update company’s currency details.
 * 
 * @param {string} code
 * @param {string} data 
 * @returns 
 */
async function update(id, data) {
    try {
        return KYCLimit.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroy(id) {
    try {
        return KYCLimit.destroy(id);
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
    destroy
}
