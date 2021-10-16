const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const OTPAuth = sequelize.define('otp_auth', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	token: Sequelize.STRING,
	transaction: Sequelize.STRING,
	expiry: Sequelize.DATE,
	status: Sequelize.STRING,
	code: Sequelize.STRING,
	device: Sequelize.JSONB,
	geoinfo: Sequelize.JSONB,
	updated: Sequelize.DATE,
	created: Sequelize.DATE,
	description: Sequelize.STRING,
	type: Sequelize.STRING,
	user_id: Sequelize.UUID,
}, {
    timestamps: false
});

module.exports = {
    OTPAuth,
}