const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const MemberProductLine = sequelize.define('member_products_line', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	member_product_id: Sequelize.UUID,
	product_id: Sequelize.UUID,
	transaction_id: Sequelize.UUID,
	start_date: Sequelize.DATE,
	end_date: Sequelize.DATE,
	value: Sequelize.FLOAT,
	status: Sequelize.STRING,
	cancellation_status: Sequelize.STRING,
	cancellation_date: Sequelize.DATE,
	cancellation_approved_by: Sequelize.UUID,
	reason: Sequelize.STRING,
	created: Sequelize.DATE,
	updated: Sequelize.DATE,
	unit: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    MemberProductLine,
}