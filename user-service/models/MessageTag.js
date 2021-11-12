const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const MessageTag = sequelize.define('message_tag', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    label: Sequelize.STRING,
    description: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    MessageTag,
}
