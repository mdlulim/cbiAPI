const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const BatchTransactions = sequelize.define('batch_transactions', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    file_name: Sequelize.STRING,
    file_url: Sequelize.STRING,
    file_status: Sequelize.STRING,
    file_type: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    BatchTransactions,
}
