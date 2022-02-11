config = {
    port: process.env.NODE_ENV ? 8080 : 8081,
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