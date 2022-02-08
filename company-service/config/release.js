config = {
    port: process.env.NODE_ENV ? 8080 : 8084,
    dbConnectionString: 'postgresql://doadmin:CtTyMZ7Vj5pcX0kc@private-qa-db-postgresql-ams3-38151-do-user-7844381-0.b.db.ondigitalocean.com:25061/release-connection_pool?sslmode=require',
    saltRounds: 2,
    jwtSecret: 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc',
    tokenExpireTime: '6h',
    tokenExpireHours: 6,
}

module.exports = config;