const jwt = require('jsonwebtoken');
const config = require('../config');

const { jwtSecret } = config;

const checkAuth = (req, res, next) => {
    var authorization = req.headers['authorization'];
    if (!authorization)
        return res.status(403).send({ auth: false, message: 'Access denied.' });

    var bearer = authorization.split(' ');

    if (bearer.length <= 1)
        return res.status(403).send({ auth: false, message: 'Access denied.' });
    
    var token = bearer[1];
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            if (req.body.type && req.body.type === 'login' && req.body.resend) {
                return res.status(500).send({
                    auth: false,
                    token_expired: true,
                    message: 'Token expired, log in again.',
                });
            }
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }

        req.user = { ...decoded, token };
        next();
    });
}

module.exports = {
    checkAuth
}
