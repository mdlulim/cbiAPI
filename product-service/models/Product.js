const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    type: Sequelize.STRING,
    permakey: Sequelize.STRING,
    title: Sequelize.STRING,
    summary: Sequelize.STRING,
    body: Sequelize.STRING,
    price: Sequelize.FLOAT,
    educator_fee: Sequelize.FLOAT,
    registration_fee: Sequelize.FLOAT,
    educator_percentage: Sequelize.INTEGER,
    registration_percentage: Sequelize.INTEGER,
    currency_code: {
        type: Sequelize.STRING,
        defaultValue: 'CBI',
    },
	metadata: Sequelize.JSONB,
	whitepaper: Sequelize.STRING,
	factsheet: Sequelize.STRING,
	sort_order: Sequelize.INTEGER,
	daily_interest: Sequelize.FLOAT,
	gross_return: Sequelize.FLOAT,
	investment_period: Sequelize.INTEGER,
	minimum_investment: Sequelize.FLOAT,
    product_code: Sequelize.STRING,
    fees: Sequelize.JSONB,
    indicators: Sequelize.JSONB,
    terms_link: Sequelize.STRING,
    category_title: Sequelize.STRING,
    subcategory_id: Sequelize.UUID,
    archived: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Product,
}