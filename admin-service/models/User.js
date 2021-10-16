const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	getstarted: Sequelize.BOOLEAN,
	mfa: Sequelize.JSONB,
	verify_token: Sequelize.UUID,
	password: Sequelize.STRING,
	created: Sequelize.DATE,
	last_login: Sequelize.DATE,
	profile: Sequelize.STRING,
	id_number: Sequelize.STRING,
	email: Sequelize.STRING,
	blocked: Sequelize.BOOLEAN,
	login_attemps: Sequelize.STRING,
	salt: Sequelize.STRING,
	updated: Sequelize.DATE,
	archived: Sequelize.BOOLEAN,
	settings: Sequelize.JSONB,
	permissions: Sequelize.JSONB,
	group_id: Sequelize.UUID,
	status: Sequelize.STRING,
	verification: Sequelize.JSONB,
	verified: Sequelize.BOOLEAN,
	timezone: Sequelize.STRING,
	mobile: Sequelize.STRING,
	metadata: Sequelize.JSONB,
	nationality: Sequelize.STRING,
	language: Sequelize.STRING,
	birth_date: Sequelize.DATE,
	username: Sequelize.STRING,
	last_name: Sequelize.STRING,
	first_name: Sequelize.STRING,
}, {
    timestamps: false,
});

module.exports = {
    User,
}
