const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const UserProduct = sequelize.define('user_product', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	user_id: Sequelize.UUID,
	product_id: Sequelize.UUID,
	start_date: Sequelize.DATE,
	end_date: Sequelize.DATE,
	income: Sequelize.FLOAT,
    tokens: Sequelize.FLOAT,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
	status: Sequelize.STRING,
    invested_amount: Sequelize.FLOAT,
    cancellation_date: Sequelize.DATE,
    cancellation_approved_by: Sequelize.UUID,
    cancellation_status: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    UserProduct,
}