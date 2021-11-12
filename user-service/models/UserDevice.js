const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const UserDevice = sequelize.define('user_device', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    device: Sequelize.STRING,
    browser: Sequelize.STRING,
    ip: Sequelize.STRING,
    location: Sequelize.STRING,
    user_id: Sequelize.UUID,
    last_login: Sequelize.DATE,
    status: Sequelize.STRING,
    verified: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    UserDevice,
}
