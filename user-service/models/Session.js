const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.define('session', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    token: Sequelize.STRING,
    duration: Sequelize.STRING,
    ip: Sequelize.STRING,
    user_agent: Sequelize.STRING,
    mfa: Sequelize.BOOLEAN,
    login: Sequelize.DATE,
    logout: Sequelize.DATE,
    expires: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Session,
}
