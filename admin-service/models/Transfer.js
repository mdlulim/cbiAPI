const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Transfer = sequelize.define('transfer_transactions', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    tx_type: Sequelize.STRING,
    subtype: Sequelize.STRING,
    note: Sequelize.STRING,
    reference: Sequelize.STRING,
    amount: Sequelize.FLOAT,
    status: Sequelize.STRING,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Transfer,
}
