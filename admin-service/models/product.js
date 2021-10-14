const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	user_id: Sequelize.UUID,
	title: Sequelize.STRING,
	description: Sequelize.STRING,
	price: Sequelize.FLOAT,
	is_service: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
	code: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
    },
	created: Sequelize.DATE,
	updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Product,
}

