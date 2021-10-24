const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('message', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    subject: Sequelize.STRING,
    body: Sequelize.STRING,
    folder_id: Sequelize.UUID,
    tags: Sequelize.STRING,
    priority: Sequelize.STRING,
    important: Sequelize.BOOLEAN,
    starred: Sequelize.BOOLEAN,
    attachments: Sequelize.JSONB,
    metadata: Sequelize.JSONB,
    sender: Sequelize.UUID,
    recipient: Sequelize.UUID,
    status: Sequelize.STRING,
    archived: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Message,
}
