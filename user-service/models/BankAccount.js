const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const BankAccount = sequelize.define('bank_account', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    name: Sequelize.STRING,
    number: Sequelize.STRING,
    type: Sequelize.STRING,
    bank_name: Sequelize.STRING,
    bank_code: Sequelize.STRING,
    branch_code: Sequelize.STRING,
    swift: Sequelize.STRING,
    iban: Sequelize.STRING,
    bic: Sequelize.STRING,
    is_primary: Sequelize.BOOLEAN,
    archived: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    BankAccount,
}
