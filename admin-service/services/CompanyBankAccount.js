const sequelize = require('../config/db');
const { CompanyBankAccount } = require('../models/CompanyBankAccount');
const { Company } = require('../models/Company');

async function create(data) {
    try {
        return CompanyBankAccount.create(data);
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

        return CompanyBankAccount.findAndCountAll({
            where,
            order: [['created', 'DESC']],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id,) {
    try {
        return CompanyBankAccount.findOne({
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
        return CompanyBankAccount.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroy(code) {
    try {
        return CompanyBankAccount.destroy(id);
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
