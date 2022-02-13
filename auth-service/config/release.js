config = {
    port: process.env.NODE_ENV ? 8080 : 8000,
    dbConnectionString: 'postgresql://doadmin:CtTyMZ7Vj5pcX0kc@qa-db-postgresql-ams3-38151-do-user-7844381-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require',
    saltRounds: 2,
    jwtSecret: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
    tokenExpireTime: '6h',
    tokenExpireHours: 6,
    baseurl: {
        admin: 'https://admin.release.cbiglobal.io',
        frontend: 'https://release.cbiglobal.io',
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
