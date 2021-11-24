const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Broadcast = sequelize.define('broadcast', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	audience: Sequelize.ARRAY,
	title: Sequelize.STRING,
	body: Sequelize.STRING,
	status: Sequelize.STRING,
	author: Sequelize.UUID,
	publisher: Sequelize.UUID,
	published: Sequelize.DATE,
	expiry: Sequelize.DATE,
	summary: Sequelize.STRING,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Broadcast,
}
