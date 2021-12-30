const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Commission = sequelize.define('commission', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	user_id: Sequelize.UUID,
	type: Sequelize.STRING,
	referral_id: Sequelize.UUID,
	commission_date: Sequelize.DATE,
	status: Sequelize.STRING,
	archived: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
	amount: Sequelize.FLOAT,
	currency_code: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    Commission,
}
