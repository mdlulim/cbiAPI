const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const sequelize = require('../config/db');
const config = require('../config');
const authService = require('../services/auth');
const userService = require('../services/user');
const activityService = require('../services/activity');
const sessionService = require('../services/session');

/**
 * Login
 * Login a user with the credentials provided. A successful login will return the user’s details 
 * and a token that can be used for subsequent requests.
 * 
 * NOTE: If multi-factor authentication is enabled, see the OTP verify endpoint for how to 
 *  verify OTPs after login.
 * @param {object} req 
 * @param {object} res 
 */
function login(req, res) {
    return authService.authenticate(req.body)
        .then(data => {
            const { device, geoinfo } = req.body;
            const token = data.token;
            const user = data.user;
            delete req.body.password;
            var expires = new Date();
            expires.setHours(expires.getHours() + config.tokenExpireHours);

            // log user activity
            return activityService.addActivity({
                user_id: user.id,
                action: 'user.login',
                description: 'User login',
                data: req.body,
                ip: (geoinfo && geoinfo.IPv4) ? geoinfo.IPv4 : null,
                section: 'Auth',
                subsection: 'Login',
                data: { device },
            })
            .then(() => {
                // add user session to database
                return sessionService.addSession({
                    user_id: user.id,
                    token,
                    duration: config.tokenExpireTime,
                    ip: (geoinfo && geoinfo.IPv4) ? geoinfo.IPv4 : null,
                    user_agent: (device && device.browser) ? `${device.browser} on ${device.os_name} ${device.os_version}` : null,
                    login: sequelize.fn('NOW'),
                    expires,
                })
                .then(() => {
                    // update user's last login status
                    return userService.updateProfile(user.id, { last_login: sequelize.fn('NOW') })
                    .then(() => {
                        res.send({
                            success: true,
                            data: data,
                        });
                    });
                });
            });
        })
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
};

/**
 * Register
 * Register a user with the credentials provided. A successful registration will return 
 * the user’s details and a token that can be used for subsequent requests.
 * @param {object} req 
 * @param {object} res 
 */
function register(req, res) {
    return userService.getUserByEmail(req.body.email)
        .then(exists => {
            if (exists){
                return res.send({
                    success: false,
                    message: 'Registration failed. User with this email and/or mobile already registered.'
                });
            }

            const code = generator.generate({ length: 4, numbers: true }).toUpperCase();
            const key  = jwt.sign({
                code,
                email: req.body.email,
            }, config.jwtSecret);
            const salt = bcrypt.genSaltSync();
            const password = bcrypt.hashSync(req.body.password, salt);
            const user = {
                email: req.body.email,
                mobile: req.body.mobile || null,
                username: req.body.username || req.body.email,
                password,
                salt,
                verification_token: key,
            };
            return userService.addUser(user)
                .then(() => res.send({ success: true }))
                .catch(err => {
                    return res.send({
                        success: false,
                        message: err.message,
                    });
                });
        })
        .catch(err => {
            res.send({
                success: false,
                message: err.message || null,
            });
        });
};

module.exports = {
   login,
   register,
}
