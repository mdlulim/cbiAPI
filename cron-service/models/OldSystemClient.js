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
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    OldSystemClient,
}
