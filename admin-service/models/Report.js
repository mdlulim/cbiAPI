const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Report = sequelize.define('report', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	name: Sequelize.STRING,
	description: Sequelize.STRING,
	type: Sequelize.STRING,
	configurations: Sequelize.JSONB,
	column_configurations: Sequelize.JSONB,
	sort_order: Sequelize.JSONB,
	output: Sequelize.JSONB,
	status: Sequelize.STRING,
	archived: Sequelize.BOOLEAN,
	created: Sequelize.DATE,
	created_by: Sequelize.UUID,
	updated: Sequelize.DATE,
	updated_by: Sequelize.UUID,
}, {
    timestamps: false
});

module.exports = {
    Report,
}