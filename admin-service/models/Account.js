const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Account = sequelize.define('account', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	name: Sequelize.STRING,
	label: Sequelize.STRING,
	reference: Sequelize.STRING,
	is_primary: Sequelize.BOOLEAN,
	user_id: Sequelize.UUID,
	company_id: Sequelize.UUID,
	account_address: Sequelize.STRING,
	metadata: Sequelize.JSONB,
	balance: Sequelize.FLOAT,
	available_balance: Sequelize.FLOAT,
	currency_code: Sequelize.STRING,
	limits: Sequelize.JSONB,
	fees: Sequelize.JSONB,
	settings: Sequelize.JSONB,
	archived: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Account,
}
