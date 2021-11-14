const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const CompanyCryptoAccount = sequelize.define('company_crypto_account', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    company_id: Sequelize.UUID,
    address: Sequelize.STRING,
    code: Sequelize.STRING,
    metadata: Sequelize.JSON,
    crypto_type: Sequelize.STRING,
    status: Sequelize.STRING,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
    currency_code: Sequelize.STRING,
    is_primary: Sequelize.BOOLEAN,
    name: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    CompanyCryptoAccount,
}