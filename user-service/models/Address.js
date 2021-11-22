const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Address = sequelize.define('address', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	user_id: Sequelize.UUID,
	line_2: Sequelize.STRING,
	line_1: Sequelize.STRING,
	state_province: Sequelize.STRING,
	country: Sequelize.STRING,
	postal_code: Sequelize.STRING,
	is_primary: Sequelize.BOOLEAN,
	is_verified: Sequelize.BOOLEAN,
	status: Sequelize.STRING,
	city: Sequelize.STRING,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Address,
}
