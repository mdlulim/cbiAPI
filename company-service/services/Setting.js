const sequelize = require('../config/db');
const { Setting } = require('../models/Setting');

async function config(query) {
    try {
        var where = {};
        if (Object.keys(query).length > 0) {
            where = query;
        } else {
            where = {
                category: 'system',
                subcategory: 'config',
            }; 
        }
        return Setting.findAll({ where });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    config,
}