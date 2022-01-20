const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const ProductSubCategory = sequelize.define('product_subcategory', {
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
    permakey: Sequelize.STRING,
    payout_settings: Sequelize.JSONB,
    calculation_settings: Sequelize.JSONB,
    has_payouts: Sequelize.BOOLEAN,
    allow_cancellations: Sequelize.BOOLEAN,
    category_id: Sequelize.UUID,
    archived: Sequelize.BOOLEAN,
    sort_order: Sequelize.INTEGER,
	category_id: Sequelize.UUID,
    allow_cancellations: Sequelize.BOOLEAN,
	payout_settings: Sequelize.JSONB,
	calculation_settings: Sequelize.JSONB,
	has_payouts: Sequelize.BOOLEAN,
	indicators: Sequelize.JSONB,
}, {
    timestamps: false
});

module.exports = {
    ProductSubCategory,
}
