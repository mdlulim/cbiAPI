const sequelize = require('sequelize');
const config = require('./keys');
const fs = require('fs');
const doCA = fs.readFileSync(__dirname + '/../' + 'ca-certificate.crt');

const sequelize = new Sequelize(config.dbConnectionString, {
    dialect: 'postgres',
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        ssl: {
            rejectUnauthorized: true,
            ca: doCA
        },
    },
});


module.exports = sequelize;