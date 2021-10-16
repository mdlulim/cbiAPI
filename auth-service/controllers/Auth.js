const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const config = require('../config');
const sequelize = require('../config/db');
const authService = require('../services/Auth');
const userService = require('../services/User');
const errorHandler = require('../helpers/errorHandler');
const activityService = require('../services/Activity');
const sessionService = require('../services/Session');

const {
    tokenExpireHours,
    tokenExpireTime,
} = config;

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
async function login(req, res) {
    try {
        const data = await authService.authenticate(req.body);
        const { device, geoinfo } = req.body;
        const { token, user } = data;
        const { group } = user;

        delete req.body.password;

        /**
         * If user group is "admin",
         * allow user to log in, otherwise perform verify login
         */
         if (group.name === 'admin') {
            const expires = new Date();
            expires.setHours(expires.getHours() + tokenExpireHours);
    
            // log user activity
            await activityService.addActivity({
                user_id: user.id,
                action: `${group.name}.login`,
                description: `${group.label} login`,
                data: req.body,
                ip: (geoinfo && geoinfo.IPv4) ? geoinfo.IPv4 : null,
                section: 'Auth',
                subsection: 'Login',
                data: { device },
            });
            
            // add user session to database
            await sessionService.addSession({
                token,
                user_id: user.id,
                duration: tokenExpireTime,
                ip: (geoinfo && geoinfo.IPv4) ? geoinfo.IPv4 : null,
                user_agent: (device && device.browser) ? `${device.browser} on ${device.os_name} ${device.os_version}` : null,
                login: sequelize.fn('NOW'),
                expires,
            });

            // update user's last login status
            await userService.update(user.id, {
                last_login: sequelize.fn('NOW'),
                blocked: false,
                login_attempts: 0,
            });

            return res.send({
                success: true,
                data: { token },
            });
        }
    
        // log user activity
        await activityService.addActivity({
            user_id: user.id,
            action: `${group.name}.login.verify`,
            description: `${group.label} verify login`,
            data: req.body,
            ip: (geoinfo && geoinfo.IPv4) ? geoinfo.IPv4 : null,
            section: 'Auth',
            subsection: 'Verify Login',
            data: { device },
        });

        
    } catch (err) {
        return errorHandler.error(err, res);
    }
    
};

/**
 * Register
 * Register a user with the credentials provided. A successful registration will return 
 * the user’s details and a token that can be used for subsequent requests.
 * @param {object} req 
 * @param {object} res 
 */
async function register(req, res) {
    const { email, first_name, last_name, mobile, username } = req.body;
    return userService.findByEmail(email)
        .then(exists => {
            if (exists){
                return res.send({
                    success: false,
                    message: 'Registration failed. User with this email address already registered.'
                });
            }

            const code = generator.generate({ length: 4, numbers: true }).toUpperCase();
            const key  = jwt.sign({
                code,
                email,
            }, config.jwtSecret);
            const salt = bcrypt.genSaltSync();
            const password = bcrypt.hashSync(req.body.password, salt);
            const user = {
                email,
                mobile: mobile || null,
                first_name: first_name || null,
                last_name: last_name || null,
                username: username || email,
                password,
                salt,
                verification_token: key,
            };
            return userService.create(user)
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

/**
 * Logout
 * 
 * Logs the current user out and invalidates the
 * token that was used to authenticate.
 */
async function logout(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Logout All
 * 
 * Logs the current user out and invalidates all
 * the tokens related to the user that have
 * expiry dates.
 */
async function logoutAll(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Change Password
 * 
 * Change a user’s password.
 * 
 * Authorization header required for authentication.
 */
async function passwordChange(req, res) {
    try {
        const { old_password, new_password1, new_password2 } = req.body;
        const user = await userService.show(req.user.id);

        if (!bcrypt.compareSync(old_password, user.password)) {
            return res.status(403).send({
                success: false,
                message: 'Validation error. Incorrect old password.'
            });
        }

        if (new_password1 !== new_password2) {
            return res.status(403).send({
                success: false,
                message: 'Validation error. Passwords do not match.'
            });
        }

        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(new_password1, salt);

        await userService.update(user.id, {
            salt,
            password,
        });

        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Reset Password
 * 
 * Send a password reset email.
 */
async function passwordReset(req, res) {
    try {
        const { email } = req.body;
        const user = await userService.findByEmail(email);

        if (!user) {
            return res.status(405).send({
                success: false,
                message: 'Authentication error. User not found.'
            });
        }

        const code  = generator.generate({ length: 4, numbers: true }).toUpperCase();
        const token = jwt.sign({
            code,
            email,
        }, config.jwtSecret);

        await userService.update(user.id, {
            verification_token: token,
        });

        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Reset Password Confirm
 * 
 * Reset a password using a reset token and uid.
 * These details are sent in an email by CBI.
 * 
 * The URL included in the reset email can be customized
 * via the dashboard in `settings -> company info`.
 * Changing this URL is required if you wish to make use
 * of your own client side UI for resetting emails.
 */
async function passwordResetConfirm(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Verify Email
 * 
 * Verify an email number with a key. The key is sent
 * in an email by CBI.
 */
async function emailVerify(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Resend Email Verification
 * 
 * Resend email verifications for an email.
 */
async function emailVerifyResend(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Verify Mobile
 * 
 * Verify a mobile number with an OTP. Unlike the “Verify Email”,
 * the user needs to be logged in for this functionality to work.
 */
async function mobileVerify(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Resend Mobile Verification
 * 
 * Resend mobile verifications for a mobile number.
 */
async function mobileVerifyResend(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Multi-factor Status
 * 
 * Provides the statuses for SMS and Token bases
 * authentication. When successfully enabled, the
 * respective type will be true.
 * 
 * CBI allows for the use of token-based or sms-otp based
 * multi-factor authentication, both of which can be fully
 * managed and utilised by the API.
 */
async function mfa(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Multi-factor Send SMS OTP
 * 
 * Sends an OTP to the mobile number that was used
 * to enabled SMS based multi-factor authentication.
 * 
 * This is only required if, for some reason, the
 * automatic SMS was not sent or a new OTP needs
 * to be generated and sent.
 */
async function createMfaSms(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Multi-factor SMS Status
 */
async function mfaSms(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Multi-factor Enable SMS
 * 
 * By posting to this endpoint you are starting the
 * verification process for enabling SMS authentication.
 * At this point an OTP will be sent to the mobile
 * number that was posted. Use this OTP to verify the
 * mobile number at the Verify endpoint.
 */
async function mfaSmsSend(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Multi-factor Disable SMS
 */
async function disableMfaSms(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Multi-factor Enable Token
 * 
 * By posting to this endpoint you are starting the
 * verification process for enabling token based
 * authentication. The response contains data that
 * can be used with apps such as Google Authenticator.
 * Use the otpauth_url to generate a QR code. For
 * more information on how to generate a QR code,
 * check out the Google Charts API. The rest of the
 * data can be used for manual entry into the app.
 * Use the token OTP generated by the app to finalise
 * the verification process at the Verify endpoint.
 */
async function createMfaToken(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Multi-factor Token Status
 */
async function mfaToken(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Multi-factor Disable Token
 */
async function destroyMfaToken(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

/**
 * Multi-factor Verify OTP
 * 
 * This endpoint finalises the verification process
 * for multi-factor authentication. Once you successfully
 * verify the SMS OTP or the token OTP, your multi-factor
 * authentication will now be enabled.
 * 
 * This endpoint is used to finalise the verification
 * process, as well as verifying a token after login.
 */
async function mfaVerify(req, res) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
   login,
   register,
   logout,
   logoutAll,
   passwordChange,
   passwordReset,
   passwordResetConfirm,
   emailVerify,
   emailVerifyResend,
   mobileVerify,
   mobileVerifyResend,
   mfa,
   createMfaSms,
   mfaSms,
   mfaSmsSend,
   disableMfaSms,
   createMfaToken,
   mfaToken,
   destroyMfaToken,
   mfaVerify,
}
