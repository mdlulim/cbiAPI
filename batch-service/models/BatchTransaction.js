const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const BatchTransaction = sequelize.define('batch_transaction', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    file_name: Sequelize.STRING,
    file_url: Sequelize.STRING,
    file_status: Sequelize.STRING,
    file_type: Sequelize.STRING,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    BatchTransaction,
}
