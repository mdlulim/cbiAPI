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
    created: Sequelize.DATE,
	status: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    UserProduct,
}