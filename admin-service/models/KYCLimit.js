const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const KYCLimit = sequelize.define('kyc_limit', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	level: Sequelize.INTEGER,
	withdrawal_limit: Sequelize.FLOAT,
}, {
    timestamps: false,
});

module.exports = {
    KYCLimit,
}