config = {
    port: process.env.NODE_ENV ? 8080 : 8087,
    dbConnectionString: 'postgresql://doadmin:CtTyMZ7Vj5pcX0kc@private-qa-db-postgresql-ams3-38151-do-user-7844381-0.b.db.ondigitalocean.com:25061/defaultdb?sslmode=require',
    saltRounds: 2,
    jwtSecret: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
    tokenExpireTime: '6h',
    tokenExpireHours: 6,
    digitalocean: {
        s3: {
            bucket: 'cdn-cbigold'
        },
        settings: {
            accessKeyId: 'IXMCZZOUJ3BZGYVNDV4P',
            endpoint: 'ams3.digitaloceanspaces.com',
            secretAccessKey: 'K80qaPbYtpdyohelallkBiFC48DLp7h+LzuHSdWEEZI',
        }
    }
}

module.exports = config;