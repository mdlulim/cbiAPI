config = {
    port: process.env.PORT,
    dbConnectionString: process.env.POSTGRES_STRING,
    saltRounds: process.env.POSTGRES_STRING,
    jwtSecret: process.env.JWT_SECRET,
    tokenExpireTime: process.env.TOKEN_EXPIRE_TIME,
    tokenExpireHours: process.env.TOKEN_EXPIRE_HOURS,
    digitalocean: {
        s3: {
            bucket: process.env.SPACES_BUCKET
        },
        settings: {
            accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
            endpoint: process.env.ENDPOINT,
            secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY,
        }
    }
}

module.exports = config;