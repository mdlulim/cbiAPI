const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const PermissionLevel = sequelize.define('permission_levels', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	level_name: Sequelize.STRING,
	archived: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    PermissionLevel,
}
