const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Archive = sequelize.define('archive', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    service: Sequelize.STRING,
    relation: Sequelize.STRING,
	description: Sequelize.STRING,
	data: Sequelize.JSONB,
	created: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Archive,
}
