const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const BuddyAccount = sequelize.define('buddy_account', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    buddy_identifier: Sequelize.STRING,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
    user_id: Sequelize.UUID,
}, {
    timestamps: false
});

module.exports = {
    BuddyAccount,
}