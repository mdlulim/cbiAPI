const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const MobileNumber = sequelize.define('mobile_number', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	user_id: Sequelize.UUID,
	number: Sequelize.STRING,
	is_primary: {
        type: Sequelize.BOOLEAN,
        primaryKey: false,
    },
	is_verified: {
        type: Sequelize.BOOLEAN,
        primaryKey: false,
    },
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    MobileNumber,
}
