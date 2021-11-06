var stage = 'dev';
var config = {};

if (stage === 'dev') {
    // local
    config = {
        port: process.env.PORT || 8081,
        dbConnectionString: 'postgresql://doadmin:bMs2X9InUxyC9DTG@db-postgresql-ams3-49623-do-user-7844381-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require',
        saltRounds: 2,
        jwtSecret: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
        tokenExpireTime: '6h',
        tokenExpireHours: 6,
        mail: {
            smtp: {
                host: 'mail.cbiglobal.io',
                port: 465,
                secure: true,
                auth: {
                    user: 'no-reply@cbiglobal.io',
                    pass: 'ocJ~$m[NTj#N',
                }
            }
        }
    }
} else {
    // staging / production
}

module.exports = config;
