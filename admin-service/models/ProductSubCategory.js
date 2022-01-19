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
    archived: Sequelize.BOOLEAN,
    has_payouts: Sequelize.BOOLEAN,
    allow_cancellations: Sequelize.BOOLEAN,
    sort_order: Sequelize.INTEGER,
    category_id: Sequelize.UUID,
    subcategory_id: Sequelize.UUID,
}, {
    timestamps: false
});

module.exports = {
    ProductSubCategory,
}
