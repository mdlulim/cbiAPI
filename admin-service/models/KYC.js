const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const KYC = sequelize.define('kyc', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	user_id: Sequelize.UUID,
	level: Sequelize.INTEGER,
	data: Sequelize.JSONB,
	documents: Sequelize.JSONB,
	status: Sequelize.STRING,
	created: Sequelize.DATE,
	updated: Sequelize.DATE,
	verified: Sequelize.BOOLEAN,
	verification_date: Sequelize.DATE,
	verified_by: Sequelize.UUID,
	withdrawal_limit: Sequelize.FLOAT,
	deposit_limit: Sequelize.FLOAT
}, {
    timestamps: false,
});

module.exports = {
    KYC,
}
