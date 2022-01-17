const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const WealthCreator = sequelize.define('wealth_creator', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
	product_id: Sequelize.UUID,
	frequency: Sequelize.STRING,
	status: Sequelize.STRING,
	fee_amount: Sequelize.FLOAT,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
	last_payment_date: Sequelize.DATE,
	last_paid_amount: Sequelize.FLOAT,
	currency_code: Sequelize.STRING,
	user_product_id: Sequelize.UUID,
}, {
    timestamps: false
});

module.exports = {
    WealthCreator,
}