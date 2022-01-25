const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const FraxionCalculation = sequelize.define('fraxion_calculation', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	ref_id: Sequelize.STRING,
	start_date: Sequelize.DATE,
	end_date: Sequelize.DATE,
	paid_out: Sequelize.BOOLEAN,
	captured_by: Sequelize.UUID,
	payout_date: Sequelize.DATE,
	payout_by: Sequelize.UUID,
	declared: Sequelize.BOOLEAN,
	type: Sequelize.STRING,
	currency_code: Sequelize.STRING,
	pool: Sequelize.FLOAT,
	prencrv: Sequelize.FLOAT,
	pool_prencrv_total: Sequelize.FLOAT,
	p3crv_compounding: Sequelize.FLOAT,
	p3crv_compounding_difference: Sequelize.FLOAT,
	reserve_pool: Sequelize.FLOAT,
	reserve_pool2: Sequelize.FLOAT,
	reserve_pool_difference: Sequelize.FLOAT,
	daily_profit: Sequelize.FLOAT,
	units: Sequelize.INTEGER,
	profit_per_unit: Sequelize.FLOAT,
	compound: Sequelize.FLOAT,
	weekly_compound: Sequelize.FLOAT,
	reserve: Sequelize.FLOAT,
	reserve_total: Sequelize.FLOAT,
	remainder: Sequelize.FLOAT,
	educator: Sequelize.FLOAT,
	educator_subtotal: Sequelize.FLOAT,
	remainder_weekly: Sequelize.FLOAT,
	remainder_pool: Sequelize.FLOAT,
	remainder_subtotal: Sequelize.FLOAT,
	unit_value: Sequelize.FLOAT,
	total_expenses: Sequelize.FLOAT,
	total_deposits: Sequelize.FLOAT,
	total_required: Sequelize.FLOAT,
	total_real: Sequelize.FLOAT,
	over_short: Sequelize.FLOAT,
	created: Sequelize.DATE,
	updated: Sequelize.DATE,
	date: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    FraxionCalculation,
}