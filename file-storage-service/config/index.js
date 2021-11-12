var stage = 'dev';
var config = {};

if (stage === 'dev') {
    // local
    config = {
        port: process.env.PORT || 8080,
        dbConnectionString: 'postgresql://doadmin:bMs2X9InUxyC9DTG@db-postgresql-ams3-49623-do-user-7844381-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require',
        saltRounds: 2,
        jwtSecret: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
        tokenExpireTime: '6h',
        tokenExpireHours: 6,
        digitalocean: {
            s3: {
                bucket: 'cdn-cbigold'
            },
            settings: {
                accessKeyId: 'IXMCZZOUJ3BZGYVNDV4P',
                accessSecretKey: 'K80qaPbYtpdyohelallkBiFC48DLp7h+LzuHSdWEEZI',
                endpoint: 'ams3.digitaloceanspaces.com'
            }
        }
    }
} else {
    // staging / production
}

module.exports = config;
