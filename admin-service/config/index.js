var stage = 'dev';
var config = {};

if (stage === 'dev') {
    // local
    config = {
        port: process.env.PORT || 8090,
        dbConnectionString: 'postgresql://doadmin:bMs2X9InUxyC9DTG@db-postgresql-ams3-49623-do-user-7844381-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require',
        saltRounds: 2,
        jwtSecret: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
        tokenExpireTime: '6h',
        tokenExpireHours: 6,
        baseurl: {
            admin: 'http://admin.cbiglobal.io',
            frontend: 'http://demo.cbiglobal.io',
        },
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
        },
        buddy: {
            baseURL: {
                staging: 'https://staging.buddy.na/api/v2/services',
                production: 'https://buddy.na/api/v2/services'
            }, 
            authenticationToken: Buffer.from("6b05e06a-cdcb-41dd-8e01-8dcf551e726d").toString('base64')
        }
    }
} else {
    // staging / production
}

module.exports = config;
