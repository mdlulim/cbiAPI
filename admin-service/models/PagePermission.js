const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const PagePermission = sequelize.define('page_permission', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    page: Sequelize.STRING,
    low: Sequelize.BOOLEAN,
    basic: Sequelize.BOOLEAN,
    medium: Sequelize.BOOLEAN,
    high: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    PagePermission,
}