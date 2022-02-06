const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Transaction = sequelize.define('transaction', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    tx_type: Sequelize.STRING,
    subtype: Sequelize.STRING,
    note: Sequelize.STRING,
    metadata: Sequelize.JSONB,
    reference: Sequelize.STRING,
    amount: Sequelize.FLOAT,
    fee: Sequelize.FLOAT,
    total_amount: Sequelize.FLOAT,
    balance: Sequelize.FLOAT,
    label: Sequelize.STRING,
    company_id: Sequelize.UUID,
    currency: Sequelize.JSONB,
    source_transaction: Sequelize.STRING,
    destination_transaction: Sequelize.STRING,
    archived: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
    collection_id: Sequelize.UUID,
    txid: Sequelize.STRING,
    auto_id: Sequelize.INTEGER,
    rejection_reason: Sequelize.STRING,
    rejected_by: Sequelize.UUID,
    approval_reason: Sequelize.STRING,
    approved_by: Sequelize.UUID,
}, {
    timestamps: false
});

module.exports = {
    Transaction,
}
