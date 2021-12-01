const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const KYCLimit = sequelize.define('kyc_limit', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	level: Sequelize.STRING,
	withdrawal_limit: Sequelize.INTEGER,
}, {
    timestamps: false
});

module.exports = {
    KYCLimit,
}
