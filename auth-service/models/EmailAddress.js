const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const EmailAddress = sequelize.define('email_address', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    email: Sequelize.STRING,
    is_primary: Sequelize.BOOLEAN,
    is_verified: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
    verification: Sequelize.JSONB,
    token: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    EmailAddress,
}
