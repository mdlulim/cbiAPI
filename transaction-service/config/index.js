var stage = 'dev';
var config = {};

if (stage === 'dev') {
    // local
    config = {
        port: process.env.PORT || 8087,
        dbConnectionString: 'postgresql://doadmin:bMs2X9InUxyC9DTG@db-postgresql-ams3-49623-do-user-7844381-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require',
        saltRounds: 2,
        jwtSecret: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
        tokenExpireTime: '6h',
        tokenExpireHours: 6,
    }
} else {
    // staging / production
}

module.exports = config;
