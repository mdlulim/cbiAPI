const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Document = sequelize.define('document', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    file: Sequelize.STRING,
    category: Sequelize.STRING,
    type: Sequelize.STRING,
    metadata: Sequelize.STRING,
    status: Sequelize.STRING,
    note: Sequelize.STRING,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Document,
}
