const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const OldSystemClient = sequelize.define('old_system_client', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
	email: Sequelize.STRING,
	username: Sequelize.STRING,
	last_name: Sequelize.STRING,
	first_name: Sequelize.STRING,
	country_name: Sequelize.STRING,
	phone_code: Sequelize.STRING,
	affiliate_key: Sequelize.STRING,
	affiliate_id: Sequelize.STRING,
	gender: Sequelize.STRING,
	phone: Sequelize.STRING,
	type: Sequelize.STRING,
	ref_id: Sequelize.INTEGER,
	migrated: Sequelize.BOOLEAN,
	blocked: Sequelize.BOOLEAN,
	user_id: Sequelize.UUID,
	group_id: Sequelize.UUID,
	metadata: Sequelize.JSONB,
	attempts: Sequelize.INTEGER,
	sponsor_id: Sequelize.UUID,
	country_iso_code: Sequelize.STRING,
	allow_migration: Sequelize.BOOLEAN,
	blocked_reason: Sequelize.STRING,
	email_verification_token: Sequelize.STRING,
	mobile_otp_code: Sequelize.INTEGER,
	mobile_verified: Sequelize.BOOLEAN,
	email_verified: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    OldSystemClient,
}
