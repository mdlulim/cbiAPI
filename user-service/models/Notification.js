const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('notification', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    enabled: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Notification,
}
