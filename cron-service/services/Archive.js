const sequelize = require('../config/db');
const { Archive } = require('../models/Archive');

async function create(data) {
    try {
        return Archive.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
}
