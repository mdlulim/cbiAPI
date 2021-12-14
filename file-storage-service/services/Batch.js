const { BatchTransactions } = require('../models/BatchTransactions');

async function create(data) {
    try {
        return BatchTransactions.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
}
