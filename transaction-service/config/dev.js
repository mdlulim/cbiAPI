config = {
    cryptrKey: 'LfFLf8cAAABwvgp',
    port: (process.env.NODE_ENV === 'develop') ? 8080 : 8089,
    dbConnectionString: 'postgresql://doadmin:bMs2X9InUxyC9DTG@db-postgresql-ams3-49623-do-user-7844381-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require',
    saltRounds: 2,
    jwtSecret: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
    tokenExpireTime: '6h',
    tokenExpireHours: 6,
    baseurl: {
        admin: 'https://admin.cbiglobal.io',
        frontend: 'https://demo.cbiglobal.io',
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
