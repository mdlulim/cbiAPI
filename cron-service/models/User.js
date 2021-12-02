const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	username: Sequelize.STRING,
	last_name: Sequelize.STRING,
	first_name: Sequelize.STRING,
	mfa: Sequelize.JSONB,
	kyc: Sequelize.JSONB,
	verify_token: Sequelize.UUID,
	password: Sequelize.STRING,
	last_login: Sequelize.DATE,
	profile: Sequelize.STRING,
	id_number: Sequelize.STRING,
	email: Sequelize.STRING,
	blocked: Sequelize.BOOLEAN,
	login_attempts: Sequelize.STRING,
	salt: Sequelize.STRING,
	settings: Sequelize.JSONB,
	permissions: Sequelize.JSONB,
	group_id: Sequelize.UUID,
	verification: Sequelize.JSONB,
	verified: Sequelize.BOOLEAN,
	timezone: Sequelize.STRING,
	mobile: Sequelize.STRING,
	metadata: Sequelize.JSONB,
	nationality: Sequelize.STRING,
	language: Sequelize.STRING,
	birth_date: Sequelize.DATE,
	currency_code: Sequelize.STRING,
	status: Sequelize.STRING,
	archived: Sequelize.BOOLEAN,
	created: Sequelize.DATE,
	updated: Sequelize.DATE,
	getstarted: Sequelize.BOOLEAN,
	terms_agree: Sequelize.BOOLEAN,
	stars: Sequelize.INTEGER,
	sponsor: Sequelize.UUID,
	referral_id: Sequelize.INTEGER,
	expiry: Sequelize.DATE,
	autorenew: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: false,
});

module.exports = {
    User,
}
