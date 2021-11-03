const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const ProductCategory = sequelize.define('product_category', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    title: Sequelize.STRING,
	description: Sequelize.STRING,
	code: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    ProductCategory,
}
