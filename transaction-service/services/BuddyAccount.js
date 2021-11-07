const { Buddy } = require('../models/Buddy');

async function store(data) {
    try {
        const buddyAccount = await Buddy.create(data);
        console.log(buddyAccount)
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    store
}