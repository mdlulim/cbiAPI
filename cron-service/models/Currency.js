const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Currency = sequelize.define('currency', {
    code: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    description: Sequelize.STRING,
    symbol: Sequelize.STRING,
    unit: Sequelize.STRING,
    divisibility: Sequelize.INTEGER,
    company_id: Sequelize.UUID,
    type: Sequelize.STRING,
    archived: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Currency,
}
