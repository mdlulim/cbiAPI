const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const TransactionCollection = sequelize.define('transaction_collection', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    archived: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    TransactionCollection,
}