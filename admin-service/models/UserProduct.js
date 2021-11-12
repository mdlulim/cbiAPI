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
    created: Sequelize.DATE,
	status: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    UserProduct,
}