const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Setting = sequelize.define('setting', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    company_id: Sequelize.UUID,
    channel: Sequelize.STRING,
    key: Sequelize.STRING,
    value: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    Setting,
}