const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('user_role', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    label: Sequelize.STRING,
    description: Sequelize.STRING,
    is_default: Sequelize.BOOLEAN,
    is_public: Sequelize.BOOLEAN,
    settings: Sequelize.JSONB,
    archived: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Role,
}