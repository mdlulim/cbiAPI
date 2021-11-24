const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const UserDevice = sequelize.define('user_device', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
	device: Sequelize.STRING,
	browser: Sequelize.STRING,
	ipv4: Sequelize.STRING,
	location: Sequelize.STRING,
	latitude: Sequelize.STRING,
	longitude: Sequelize.STRING,
    status: Sequelize.STRING,
	country_code: Sequelize.STRING,
	country_name: Sequelize.STRING,
	token: Sequelize.STRING,
	last_login: Sequelize.DATE,
    verified: Sequelize.BOOLEAN,
	blacklisted: Sequelize.BOOLEAN,
    is_mobile: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    UserDevice,
}
