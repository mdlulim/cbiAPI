config = {
    cryptrKey: 'LfFLf8cAAABwvgp',
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
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        }
    }
}

module.exports = config;
