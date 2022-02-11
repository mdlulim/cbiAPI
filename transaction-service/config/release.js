config = {
    cryptrKey: 'LfFLf8cAAABwvgp',
    port: process.env.NODE_ENV ? 8080 : 8089,
    dbConnectionString: 'postgresql://doadmin:CtTyMZ7Vj5pcX0kc@qa-db-postgresql-ams3-38151-do-user-7844381-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require',
    saltRounds: 2,
    jwtSecret: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
    tokenExpireTime: '6h',
    tokenExpireHours: 6,
    baseurl: {
        admin: 'https://admin.cbiglobal.io',
        frontend: 'https://demo.cbiglobal.io',
        api: 'https://dev.cbiglobal.io/v1/',
    },
    coinPayments: {
        key: '6198f48a55ebd548512ba5106ee7e8b382cd8e7116db8ecda0732f65c34521b8',
        secret: '27aedb32B7D525E06454A09f5ff8598575425e9900273Af0c4118Fb5255492Aa',
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
