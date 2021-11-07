const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Activity = sequelize.define('activity', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    action: Sequelize.STRING,
    description: Sequelize.STRING,
    section: Sequelize.STRING,
    subsection: Sequelize.STRING,
    data: Sequelize.JSONB,
    ip: Sequelize.STRING,
    created: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Activity,
}