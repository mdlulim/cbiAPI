const config = require('../config');
const Sequelize = require('sequelize');
const fs = require('fs');
const doCA = fs.readFileSync(__dirname + '/../' + 'ca-certificate.crt');
var sequelize = new Sequelize(config.dbConnectionString, {
    ssl: true,
    dialect: 'postgres',
    dialectOptions: {
        // connectTimeout: 120000,
        dateStrings: true,
        typeCast: true,
        ssl: {
            rejectUnauthorized: true,
            ca: doCA
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
sequelize.authenticate()
.then(res => {
    console.log('test')
});
console.log('after auth')
require('sequelize-values')(sequelize);

module.exports = sequelize;
