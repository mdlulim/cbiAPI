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
	archived: Sequelize.BOOLEAN,
	currency_code: Sequelize.STRING,
	created: Sequelize.DATE,
	updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Fee,
}
