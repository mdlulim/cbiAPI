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
    body: Sequelize.STRING,
    price: Sequelize.FLOAT,
    currency_code: Sequelize.STRING,
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
