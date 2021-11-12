const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Beneficiary = sequelize.define('beneficiary', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    gender: Sequelize.STRING,
    id_number: Sequelize.STRING,
    relationship: Sequelize.STRING,
    percentage: Sequelize.INTEGER,
    dob: Sequelize.DATE,
    archived: Sequelize.BOOLEAN,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Beneficiary,
}
