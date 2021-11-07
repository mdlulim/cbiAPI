const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Buddy = sequelize.define('buddy_accounts', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    buddy_identifier: Sequelize.STRING,
    user_id: Sequelize.UUID,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Buddy,
}