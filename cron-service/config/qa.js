config = {
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
    },
    smsApi: {
        provider: 'sinch',
        sinch: {
            baseUrl: 'https://sms.api.sinch.com/xms/v1/',
            servicePlanID: '2774eff8837d47148f4a0671a2412785',
            apiKey: 'f2bc6930ae434c17b84235a58e2df77f',
            senderID: '447537432321',
        },
        expertTexting: {
            baseUrl: 'https://www.experttexting.com/ExptRestApi/sms/json/',
            username: 'cbiglobal',
            apiKey: '6qnwzv07s019kr0',
            apiSecret: '8dphg44g5qz0y15',
            senderID: 'DEFAULT',
        },
        baseUrl: 'https://sms.api.sinch.com/xms/v1/',
        servicePlanID: '2774eff8837d47148f4a0671a2412785',
        apiKey: 'f2bc6930ae434c17b84235a58e2df77f',
        senderID: '447537432321',
    },
}

module.exports = config;