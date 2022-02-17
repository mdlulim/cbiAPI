const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const CommissionPayout = sequelize.define('commission_payout', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	product_code: Sequelize.STRING,
	payment_date: Sequelize.DATE,
	captured_by: Sequelize.UUID,
    data: Sequelize.JSONB,
    created: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    CommissionPayout,
}