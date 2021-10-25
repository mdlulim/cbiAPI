const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Company = sequelize.define('company', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    website: Sequelize.STRING,
    email: Sequelize.STRING,
    logo: Sequelize.STRING,
    address: Sequelize.JSON,
    settings: Sequelize.STRING,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Company,
}
