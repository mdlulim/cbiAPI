const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('notification', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    activity: Sequelize.STRING,
    description: Sequelize.STRING,
    key: Sequelize.STRING,
    sms: Sequelize.BOOLEAN,
    email: Sequelize.BOOLEAN,
    push: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Notification,
}
