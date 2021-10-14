const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('customer', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
	name: Sequelize.STRING,
	email: Sequelize.STRING,
	phone: Sequelize.STRING,
	contact: Sequelize.JSONB,
	billing_address: Sequelize.JSONB,
	shipping_address: Sequelize.JSONB,
	account_number: Sequelize.STRING,
	fax: Sequelize.STRING,
	mobile: Sequelize.STRING,
	website: Sequelize.STRING,
	notes: Sequelize.STRING,
	active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    Customer,
}

