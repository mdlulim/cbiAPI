const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Fee = sequelize.define('fee', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    tx_type: Sequelize.STRING,
    value: Sequelize.FLOAT,
    percentage: Sequelize.FLOAT,
    subtype: Sequelize.STRING,
    currency_code: Sequelize.STRING,
    archived: Sequelize.BOOLEAN,
    group_id: Sequelize.UUID,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Fee,
}