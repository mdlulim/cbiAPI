const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const rn = require('random-number');
const generator = require('generate-password');
const config = require('../config');
const sequelize = require('../config/db');
const authService = require('../services/Auth');
const userService = require('../services/User');
const groupService = require('../services/Group');
const accountService = require('../services/Account');
const emailAddressService = require('../services/EmailAddress');
const mobileNumberService = require('../services/MobileNumber');
const notificationService = require('../services/Notification');
const errorHandler = require('../helpers/errorHandler');
const activityService = require('../services/Activity');
const sessionService = require('../services/Session');
const emailHandler = require('../helpers/emailHandler');

const {
    jwtSecret,
    tokenExpireHours,
    tokenExpireTime,
} = config;

async function validate(req, res) {
    try {
        const { prop, value } = req.params;
        const user = await userService.findByPropertyValue(prop, value);
        return res.send({
            success: true,
            exists: (user && user.id) ? true : false,
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function tokensVerify(req, res) {
    try {
        const { type } = req.body;
        const params = req.user;
        params.type = type;
        if (type === 'login') {
            const data = await authService.verifyLogin({
                ...req.user,
                ...req.body
            });
            return res.send(data);
        }
        const data = await authService.tokensVerify(params);
        return res.send(data);
    } catch (error) {
        return res.send({
            success: false,
            message: error.message || 'Could not process request'
        });
    }
}

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
        const { group, email, first_name } = user;
        delete req.body.password;

        /**
         * If user group is "admin",
         * allow user to log in, otherwise perform verify login
         */
        const isAdmin = group.name === 'admin';

        if (isAdmin) {
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
                data: {
                    token,
                    admin: true,
                },
            });
        }

        // log user activity
        const transaction = `${group.name}.login.verify`;
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

        // auth (jwt) token
        const payload = {
            email,
            id: user.id,
            time: new Date(),
        };
        const verifyToken = jwt.sign(payload, jwtSecret, {
            expiresIn: '15m',
        });

        // generate otp code
        const code = rn({
            min: 1000,
            max: 9999,
            integer: true,
        });
        const authRecord = {
            user_id: user.id,
            device: device || {},
            geoinfo: geoinfo || {},
            type: 'OTP',
            description: `${group.label} verify login`,
            expiry: moment().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
            transaction,
            code,
            verifyToken,
        };

        // delete previous otp login attemps/records
        // and insert a new record
        await authService.deleteOtp(user.id);
        await authService.createOtp(authRecord);

        // update user's last login status
        await userService.update(user.id, {
            last_login: sequelize.fn('NOW'),
            blocked: false,
            login_attempts: 0,
        });

        // send verify login email
        await emailHandler.verifyLogin({
            first_name,
            email,
            code,
        });
        return res.send({
            success: true,
            data: {
                admin: group.name === 'admin',
                token: verifyToken,
            },
        });

    } catch (err) {
        return errorHandler.error(err, res);
    }
};

function cleanMobile(data) {
    const { mobile, country } = data;
    if (mobile) {
        if (country.iso === 'ZA') {
            if (mobile.indexOf('0') === 0) {
                return country.phone_code + mobile.substr(1);
            }
            if (mobile.indexOf('+27') === 0) {
                return country.phone_code + mobile.substr(3);
            }
            if (mobile.indexOf('27') === 0) {
                return country.phone_code + mobile.substr(2);
            }
        }
    }
    return mobile;
}

function cleanEmail(email) {
    return email ? email.trim() : email;
}

/**
 * Register
 * Register a user with the credentials provided. A successful registration will return 
 * the user’s details and a token that can be used for subsequent requests.
 * @param {object} req 
 * @param {object} res 
 */
async function register(req, res) {
    try {
        const {
            username,
            last_name,
            first_name,
            referral_id,
            nationality,
            timezone,
            marketing,
        } = req.body;

        // validate terms check
        if (!req.body.terms_agree) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Please accept CBI Terms and Conditions.'
            });
        }

        // validate email address
        if (!req.body.email) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Email address is required.'
            });
        }

        // validate nationality
        if (!req.body.nationality) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Nationality is required.'
            });
        }

        // validate mobile number
        if (!req.body.mobile) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Mobile number is required.'
            });
        }

        // validate password
        if (!req.body.password) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Password is required.'
            });
        }

        // validate confirm password
        if (!req.body.confirm_password) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Confirm Password is required.'
            });
        }

        // validate if passwords match
        if (req.body.confirm_password !== req.body.password) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Password do not match.'
            });
        }

        const mobile = (mobile) ? cleanMobile(req.body) : null;
        const email = cleanEmail(req.body.email);

        let isLead = true;
        const exists = await userService.findByEmail(email);
        if (exists) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. User with this email address already registered.'
            });
        }

        let role = null;
        let sponsorId = null;
        let groupId = null;
        let sponsor = null;

        if (referral_id) {
            sponsor = await userService.findByReferralId(referral_id);
            if (sponsor.id) {
                isLead = false;
                sponsorId = sponsor.id;
                role = await groupService.findByPropertyValue('name', 'member');
                groupId = role.id;
            }
        }

        // lead check and assign respective role
        if (isLead) {
            role = await groupService.findByPropertyValue('name', 'lead');
            groupId = role.id;
        }

        const code  = generator.generate({ length: 4, numbers: true }).toUpperCase();
        const token = jwt.sign({
            code,
            email,
        }, jwtSecret, {
            expiresIn: '30m'
        });
        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(req.body.password, salt);
        const user = {
            email,
            mobile: mobile || null,
            first_name: first_name || null,
            last_name: last_name || null,
            username: username || email,
            sponsor: sponsorId,
            group_id: groupId,
            password,
            salt,
            verification: null,
            nationality: nationality || null,
            timezone: timezone || null,
        };

        if (!isLead) {
            user.verification = {
                token,
                email: false,
                mobile: false,
            };
        }

        // create user
        const newUser = await userService.create(user);

        if (newUser && newUser.id) {

            // notify upline once referral has registered
            if (sponsor && sponsor.id) {
                await emailHandler.notifyReferrer({
                    first_name: sponsor.first_name,
                    email: sponsor.email,
                    referral: `${first_name} ${last_name} - ${first_name}`,
                });
            }

            // send activation email (if is not a lead)
            if (!isLead) {
                await emailHandler.confirmEmail({
                    first_name,
                    email,
                    token,
                });
            }
            
            // create user cbi wallet
            await accountService.create({
                name: 'cbi-wallet',
                label: 'CBI Wallet',
                reference: referral_id,
                is_primary: true,
                user_id: newUser.id,
            });

            // create primary email address record
            await emailAddressService.create({
                user_id: newUser.id,
                email: email,
                is_primary: true,
                verification: user.verification,
                token,
            });

            // create primary mobile number record
            await mobileNumberService.create({
                user_id: newUser.id,
                number: mobile,
                is_primary: true,
            });

            // create (default) notification record for the user
            await notificationService.create({
                user_id: newUser.id,
                activity: 'Marketing & Communication',
                description: 'Get the latest promotions, updates and tips',
                sms: marketing || false,
                email: marketing || false,
                push: marketing || false,
            });

            // response
            return res.send({
                success: true,
                lead: isLead,
            });
        } else {
            throw new Error('Request could not be processed, please try again or contact support.');
        }
    } catch (err) {
        return errorHandler.error(err, res);
    }
}

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
        const { old_password, new_password1, new_password2, geoinfo } = req.body;
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
            updated: sequelize.fn('NOW'),
        });

        // audit trail / activity logging
        await activityService.addActivity({
            user_id: user.id,
            action: `${user.group.name}.password.change`,
            description: `${user.group.label} changed password`,
            data: null,
            ip: (geoinfo && geoinfo.IPv4) ? geoinfo.IPv4 : null,
            section: 'Account',
            subsection: 'Change password',
            data: { device },
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
                message: 'Email address not registered.'
            });
        }

        const code = generator.generate({ length: 4, numbers: true });
        const token = jwt.sign({
            code,
            email,
        }, config.jwtSecret);

        const verification = {
            ...user.verification,
            token,
        };

        await userService.update(user.id, {
            verification,
            updated: sequelize.fn('NOW'),
        });

        // send reset password email
        const { first_name } = user;
        await emailHandler.resetPassword({
            first_name,
            email,
            token,
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

/**
 * Multi-factor Verify OTP
 * 
 * Authenticate Token
 */
async function refresh(req, res) {
    try {
        return res.send({
            auth: true,
            data: req.user,
        });
    } catch (error) {
        return res.send({
            auth: false,
            message: 'Could not process request. Authentication failed'
        });
    }
}

module.exports = {
    validate,
    tokensVerify,
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
    refresh,
}
