const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const EventStore = sequelize.define('event_store', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	action: Sequelize.STRING,
	provider: Sequelize.STRING,
	description: Sequelize.STRING,
	request: Sequelize.JSONB,
	response: Sequelize.JSONB,
	status: Sequelize.STRING,
	ref: Sequelize.STRING,
	ref_id: Sequelize.UUID,
	metadata: Sequelize.JSONB,
	created: Sequelize.DATE,
	updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    EventStore,
}