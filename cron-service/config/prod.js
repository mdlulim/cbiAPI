config = {
    port: process.env.PORT,
    dbConnectionString: process.env.POSTGRES_STRING,
    saltRounds: process.env.POSTGRES_STRING,
    jwtSecret: process.env.JWT_SECRET,
    tokenExpireTime: process.env.TOKEN_EXPIRE_TIME,
    tokenExpireHours: process.env.TOKEN_EXPIRE_HOURS,
    baseurl: {
        admin: process.env.BASE_URL_ADMIN,
        frontend: process.env.BASE_URL_FRONTEND,
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
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
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