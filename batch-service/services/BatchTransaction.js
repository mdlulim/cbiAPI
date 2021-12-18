const sequelize = require('../config/db');
const { BatchTransaction }  = require('../models/BatchTransaction');

async function showFile(id) {
    try {
        return BatchTransaction.findOne({
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}


module.exports = {
    showFile
}
