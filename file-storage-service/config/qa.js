config = {
    port: process.env.PORT || 8080,
    dbConnectionString: 'postgresql://develop:6MO4vuw9fpn3dvfa@db-postgresql-ams3-49623-do-user-7844381-0.b.db.ondigitalocean.com:25060/qa?sslmode=require',
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