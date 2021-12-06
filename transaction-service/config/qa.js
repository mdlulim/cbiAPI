config = {
    cryptrKey: 'LfFLf8cAAABwvgp',
    port: process.env.PORT || 8080,
    dbConnectionString: 'postgresql://develop:6MO4vuw9fpn3dvfa@db-postgresql-ams3-49623-do-user-7844381-0.b.db.ondigitalocean.com:25060/qa?sslmode=require',
    saltRounds: 2,
    jwtSecret: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
    tokenExpireTime: '6h',
    tokenExpireHours: 6,
    baseurl: {
        admin: 'http://admin.qa.cbiglobal.io',
        frontend: 'http://qa.cbiglobal.io',
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
    }
}

module.exports = config;
