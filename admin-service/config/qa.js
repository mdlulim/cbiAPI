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
        baseUrl: 'https://sms.api.sinch.com/xms/v1/',
        servicePlanID: '2774eff8837d47148f4a0671a2412785',
        apiKey: 'f2bc6930ae434c17b84235a58e2df77f',
        senderID: '447537432321',
    },
    buddy: {
        staging: {
            base_url: 'https://staging.buddy.na/api/v2/services',
            authenticationToken: Buffer.from("6b05e06a-cdcb-41dd-8e01-8dcf551e726d").toString('base64')
        }
    }
}

module.exports = config;