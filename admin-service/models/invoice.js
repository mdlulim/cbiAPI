const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Invoice = sequelize.define('invoice', {
    uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
	user_id: Sequelize.UUID,
	customer_id: Sequelize.UUID,
	reference: Sequelize.STRING,
	is_quote: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
	expiry: Sequelize.DATE,
	date: Sequelize.DATE,
	currency: Sequelize.STRING,
	memo: Sequelize.STRING,
	footer: Sequelize.STRING,
	subheading: Sequelize.STRING,
	po: Sequelize.STRING,
	subtotal: Sequelize.FLOAT,
	total: Sequelize.FLOAT,
	products: Sequelize.JSONB,
	taxable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
	taxes: Sequelize.JSONB,
	status: {
        type: Sequelize.STRING,
        defaultValue: 'Pending',
    },
	archived: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
	created: Sequelize.DATE,
	updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Invoice,
}

