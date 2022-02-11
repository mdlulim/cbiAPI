config = {
    port: process.env.NODE_ENV ? 8080 : 8088,
    dbConnectionString: 'postgresql://doadmin:CtTyMZ7Vj5pcX0kc@qa-db-postgresql-ams3-38151-do-user-7844381-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require',
    saltRounds: 2,
    jwtSecret: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
    tokenExpireTime: '6h',
    tokenExpireHours: 6,
    baseurl: {
        admin: 'https://admin.cbiglobal.io',
        frontend: 'https://demo.cbiglobal.io',
    },
    exchange: {
        baseurl: 'https://rest.coinapi.io/v1/',
        apikey: '0FCA5251-0895-436A-AF36-7BB934265A3A',
    },
    products: {
        CBIx7: 'CBIX7',
        WC: 'WC',
        FP: 'FP',
        FX: 'FX',
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
