const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Password = sequelize.define('password', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    password: Sequelize.STRING,
    created: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Password,
}