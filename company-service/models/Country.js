const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Country = sequelize.define('country', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    iso: Sequelize.STRING,
    iso3: Sequelize.STRING,
    name: Sequelize.STRING,
    nicename: Sequelize.STRING,
    num_code: Sequelize.INTEGER,
    phone_code: Sequelize.INTEGER,
    blacklisted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: false
});

module.exports = {
    Country,
}
