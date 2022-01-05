const sequelize = require('../config/db');
const { EventStore } = require('../models/EventStore');

async function create(data) {
    try {
        return EventStore.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(data, id) {
    try {
        data.updated = sequelize.fn('NOW');
        return EventStore.update(data, {
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    update,
}
