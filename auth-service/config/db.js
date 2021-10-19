const config = require('../config');
const Sequelize = require('sequelize');
var sequelize = new Sequelize(config.dbConnectionString, {
    ssl: true,
    dialect: 'postgres',
    dialectOptions: {
        // connectTimeout: 120000,
        dateStrings: true,
        typeCast: true,
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
    },
    timezone: 'Africa/Johannesburg',
    pool: {
        max: 100,
        min: 0,
        idle: 200000,
        acquire: 1000000,
    }
});
require('sequelize-values')(sequelize);

module.exports = sequelize;
