const sequelize = require('../config/db');

async function index() {
    try {
        return {
            success: true,
            data: {
                count: 0,
                next: null,
                previous: null,
                results: [],
            }
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    index,
}