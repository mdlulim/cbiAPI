const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Group = sequelize.define('group', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    label: Sequelize.STRING,
    channel: Sequelize.STRING,
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
    Group,
}