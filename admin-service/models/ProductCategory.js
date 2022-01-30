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
	summary: Sequelize.STRING,
	body: Sequelize.STRING,
    code: Sequelize.STRING,
    ProductCategory: Sequelize.JSONB,
	permakey: Sequelize.STRING,
    archived: Sequelize.BOOLEAN,
    sort_order: Sequelize.INTEGER,
}, {
    timestamps: false
});

module.exports = {
    ProductCategory,
}
