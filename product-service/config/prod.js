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
    }
}

module.exports = config;
