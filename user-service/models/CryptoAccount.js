const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const CryptoAccount = sequelize.define('crypto_account', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    address: Sequelize.STRING,
    code: Sequelize.STRING,
    metadata: Sequelize.JSON,
    crypto_Sequelize: Sequelize.STRING,
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
    CryptoAccount,
}
