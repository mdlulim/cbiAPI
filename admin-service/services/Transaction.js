const sequelize = require('../config/db');
const { Transaction } = require('../models/Transaction');

async function index(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};

        delete where.offset;
        delete where.limit;

        return Transaction.findAndCountAll({
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

async function show(id) {
    try {
        return Transaction.findOne({
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function getProofOfPayment(user_id) {
    try {
        return Transaction.findOne({
            where: { user_id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    index,
    show,
    getProofOfPayment
}
