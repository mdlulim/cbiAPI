const sequelize = require('../config/db');
const { KYC } = require('../models/KYC');

async function create(data) {
    try {
        return KYC.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function index(user_id) {
    try {
        return KYC.findAndCountAll({
            where: { user_id },
            order: [['created', 'DESC']],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    index,
}
