const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const rn = require('random-number');
const generator = require('generate-password');
const authenticator = require('authenticator');
const config = require('../config');
const sequelize = require('../config/db');
const authService = require('../services/Auth');
const otpService = require('../services/OTPAuth');
const userService = require('../services/User');
const groupService = require('../services/Group');
const accountService = require('../services/Account');
const emailAddressService = require('../services/EmailAddress');
const mobileNumberService = require('../services/MobileNumber');
const notificationService = require('../services/Notification');
const passwordService = require('../services/Password');
const errorHandler = require('../helpers/errorHandler');
const activityService = require('../services/Activity');
const sessionService = require('../services/Session');
const emailHandler = require('../helpers/emailHandler');
const { sendOTPAuth } = require('../helpers/smsHandler');
const {
    loginSchema,
    registerSchema,
} = require('../schema');

const {
    jwtSecret,
    tokenExpireHours,
    tokenExpireTime,
} = config;

async function validate(req, res) {
    try {
        const { prop, value } = req.params;
        const user = await userService.findByPropertyValue(prop, value);
        const data = {};
        if (user) {
            data.first_name = user.first_name;
            data.last_name = user.last_name;
            data.referral_id = user.referral_id;
        }
        return res.send({
            success: true,
            exists: (user && user.id) ? true : false,
            data,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function tokensVerify(req, res) {
    try {
        console.log(req.body)
        const { type } = req.body;
        if (type === 'login') {
            const data = await authService.verifyLogin({
                ...req.user,
                ...req.body,
            });
            return res.send(data);
        }
        if (type === 'reset-password') {
            const data = await authService.verifyResetPassword({
                ...req.user,
                ...req.body
            });
            return res.send(data);
        }
        if (type === 'activation') {
            const data = await authService.tokensVerify({
                ...req.user,
                ...req.body
            });
            return res.send(data);
        }
        const data = await authService.tokensVerify({
            ...req.user,
            ...req.body,
            transaction: `${req.user.group_name.toLowerCase()}.${req.body.type}`,
        });
        return res.send(data);
    } catch (error) {
        const messages = ['Access denied', 'Invalid code specified', 'Account temporarily blocked'];
        var message = 'Could not process request';
        var inerror = false;
        messages.map(item => {
            if (error.message.includes(item)) inerror = true;
        });
        if (inerror) {
            message = error.message;
        }
        return res.status(500).send({
            success: false,
            message,
        });
    }
}

async function tokensValidate(req, res) {
    try {
        const { device, type, resend } = req.body;
        const { email } = req.user;
        const user = await authService.findUser({
            email,
            verified: false,
            blocked: false,
        }, ['id', 'mobile']);

        if (!user) {
            return res.status(500).send({
                success: false,
                message: 'Access denied',
            });
        }

        switch (type) {
            case 'activation':
                var sent = false;
                var otp  = {};
                if (!resend) {
                    const { Op } = sequelize;
                    otp = await otpService.find({
                        transaction: 'member.register.verify',
                        status: { [Op.iLike]: 'Pending' },
                        expiry: {
                            [Op.gte]: sequelize.literal("NOW() - INTERVAL '1 MINUTE'"),
                        }
                    });
                    if (otp && otp.code) {
                        sent = true;
                    }
                }

                if (!otp || !otp.code) {
                    // send otp for mobile verification
                    // destroy all old OTP records
                    await otpService.destroyAll({
                        user_id: user.id,
                    });

                    // create/log OTP record
                    const otpRecord = {
                        device,
                        transaction: 'member.register.verify',
                        description: 'New member account activation/verification',
                        user_id: user.id,
                    };
                    otp = await otpService.create(otpRecord);
                }

                // send OTP auth
                if (otp.code && !sent) {
                    const mobile = user.mobile.replace('+', '');
                    await sendOTPAuth(mobile, otp.code);
                }

                // response
                return res.send({
                    auth: true,
                    data: { mobile: user.mobile }
                });

            default:
                return res.send({
                    auth: true
                });
        }

    } catch (error) {
        const messages = ['Access denied', 'Invalid code specified'];
        var message = 'Could not process request';
        var inerror = false;
        messages.map(item => {
            if (error.message.includes(item)) inerror = true;
        });
        if (inerror) {
            message = error.message;
        }
        console.log(error.message)
        return res.status(500).send({
            success: false,
            message,
        });
    }
}

async function validateMigrateEmail(req, res) {
    try {
        const { email } = req.body;
        const user = await userService.showOldUser(email);
        return res.send({
            success: true,
            exists: (user && user.id) ? true : false,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function validateMigrateToken(req, res) {
    try {
        const { token } = req.body;
        const migrate = await userService.showOldUserByToken(token);
        const data = {};
        let auth = false;

        if (migrate && migrate.id) {
            const {
                id,
                phone,
                metadata,
                email,
            } = migrate;
            const { salt, password } = metadata;

            /** 
             * Migrate record to the user's table
             */
            const newUser = await userService.findByEmail(cleanEmail(email), {
                blocked: false,
                verified: false,
                archived: false,
                old_system_user: true,
            });

            if (!newUser) {
                return res.status(403).send({
                    success: false,
                    message: 'Migration failed. Please contact support.'
                });
            }

            if (newUser && newUser.id) {

                // update user record
                await userService.update(newUser.id, {
                    salt,
                    password,
                    verified: true,
                });

                // create user cbi wallet
                await accountService.create({
                    name: 'cbi-wallet',
                    label: 'CBI Wallet',
                    reference: newUser.referral_id,
                    is_primary: true,
                    user_id: newUser.id,
                });

                // create primary email address record
                await emailAddressService.create({
                    user_id: newUser.id,
                    email: cleanEmail(email),
                    is_primary: true,
                    is_verified: true,
                });

                // create primary mobile number record
                if (newUser.mobile) {
                    await mobileNumberService.create({
                        user_id: newUser.id,
                        number: newUser.mobile,
                        is_primary: true,
                        is_verified: false,
                    });
                }

                // create (default) notification record for the user
                const notifications = [];
                notifications.push({
                    user_id: newUser.id,
                    key: 'marketing-communication',
                    activity: 'Marketing & Communication',
                    description: 'Get the latest promotions, updates and tips',
                    sms: true,
                    email: true,
                    push: true,
                });
                notifications.push({
                    user_id: newUser.id,
                    key: 'account-activity-updates',
                    activity: 'Account Activity & Updates',
                    description: 'Get notified about your account activity and updates. Choose the type(s) of notification to get notified with.',
                    sms: true,
                    email: true,
                    push: true,
                });
                await notificationService.create(notifications);
            }

            if (newUser.mobile) {

                // create/generate
                const code = await otpService.migrateCreate({
                    email_verified: true,
                    metadata,
                }, id);

                // send OTP (SMS)
                if (code) {
                    const mobile = phone.replace('+', '');
                    await sendOTPAuth(mobile, code);
                }
            }

            // update migration table
            await userService.updateOldUser({
                migrated: true,
            }, id);

            // success
            auth = true;
            data.mobile = newUser.mobile;
        }
        return res.send({
            auth,
            data,
            success: true,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function migrateTokenResend(req, res) {
    try {
        const { token } = req.body;
        const migrate = await userService.showOldUserByToken(token, true);

        if (migrate && migrate.id) {
            const { id, phone, metadata } = migrate;

            // create/generate
            const code = await otpService.migrateCreate({
                metadata,
            }, id);

            // send OTP (SMS)
            if (code) {
                const mobile = phone.replace('+', '');
                await sendOTPAuth(mobile, code);
            }

            return res.send({
                success: true,
            });
        }
        return res.status(403).send({
            success: false,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function migrateMobileConfirm(req, res) {
    try {
        const { token, code } = req.body;
        const migrate = await userService.showOldUserByToken(token);

        if (migrate && migrate.id) {
            const { id, user_id, mobile_otp_code, attempts } = migrate;

            if (attempts >= 3) {
                // block record
                await userService.updateOldUser({
                    blocked: true,
                    blocked_reason: 'OTP attempts exceeded, user provided wrong OTP for more than 3 times.'
                }, id);

                // return error message
                return res.status(403).send({
                    auth: false,
                    success: false,
                    message: 'Wrong OTP code provided. Attempts exceeded, please contact support for further assistance.',
                });
            }
            
            // check if codes match
            if (mobile_otp_code === code) {
                // update attempts
                await userService.updateOldUser({
                    migrated: true,
                    mobile_otp_code: null,
                    mobile_verified: true,
                    email_verification_token: null,
                }, id);

                // update mobile numbers table record
                await mobileNumberService.update({
                    is_verified: true,
                }, user_id);

                // get user record
                const user = await userService.show(user_id);
                const { verification } = user;

                // update user table record
                await userService.update(user_id, {
                    verification: {
                        ...verification,
                        mobile: true,
                    },
                })

                // return success
                return res.send({
                    success: true,
                });
            }

            // update attempts
            await userService.updateOldUser({
                attempts: attempts + 1,
            }, id);

            // return error message
            return res.status(403).send({
                auth: false,
                success: true,
                message: `Wrong OTP code provided, you have ${3 - attempts} left.`,
            });
        }

        // return error message
        return res.status(403).send({
            auth: false,
            success: false,
            message: 'Access denied',
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function migrateConfirm(req, res) {
    try {
        const {
            confirm_password,
            password,
            geoinfo,
            device,
            email,
        } = req.body;

        // validate email
        if (!email) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Email address is required.'
            });
        }

        // validate password
        if (!password) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Password is required.'
            });
        }

        // validate confirm password
        if (!confirm_password) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Confirm Password is required.'
            });
        }

        // validate if passwords match
        if (confirm_password !== password) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Password do not match.'
            });
        }

        const user = await userService.showOldUser(email);

        if (!user) {
            return res.status(403).send({
                success: false,
                message: 'Access denied'
            });
        }

        const code = generator.generate({ length: 6, numbers: true }).toUpperCase();
        const token = jwt.sign({
            code,
            id: user.id,
        }, jwtSecret, {
            expiresIn: '30m'
        });

        // generate salt
        const salt = bcrypt.genSaltSync();
        const encPassword = bcrypt.hashSync(password, salt);

        // update
        await userService.updateOldUser({
            email_verification_token: token,
            metadata: {
                password: encPassword,
                token_expiry: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                geoinfo,
                device,
                salt,
            }
        }, user.id);

        // send verification email
        await emailHandler.migrateConfirmEmail({
            first_name: user.first_name,
            email: user.email,
            token,
        });

        return res.send({
            success: true
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function resendActivationEmail(req, res) {
    try {
        const { Op } = sequelize;
        const { email } = req.body;
        const user = await userService.findByEmail(email, {
            archived: false,
            blocked: false,
            verified: false,
            status: {
                [Op.iLike]: 'Pending',
            }
        });

        if (!user) {
            return res.status(403).send({
                success: false,
                message: 'Access denied'
            });
        }

        const code = generator.generate({ length: 4, numbers: true }).toUpperCase();
        const token = jwt.sign({
            code,
            email: user.email,
        }, jwtSecret, {
            expiresIn: '30m'
        });

        await emailHandler.confirmEmail({
            first_name: user.first_name,
            email: user.email,
            token,
        });

        return res.send({
            success: true
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function tokensVerifyResend(req, res) {
    try {
        const {
            type,
            device,
            geoinfo,
            newDeviceLogin,
        } = req.body;
        const { id } = req.user;

        if (type === 'login') {

            const user = await userService.show(id);

            if (!user) {
                throw new Error('Access denied.');
            }

            // auth (jwt) token
            const { email, group, first_name } = user;
            const payload = {
                id,
                email,
                time: new Date(),
                newDeviceLogin,
            };
            const verifyToken = jwt.sign(payload, jwtSecret, {
                expiresIn: '15m',
            });

            // generate otp code
            const code = rn({
                min: 100000,
                max: 999999,
                integer: true,
            });

            const transaction = `${group.name}.login.verify`;
            const authRecord = {
                user_id: user.id,
                device: device || {},
                geoinfo: geoinfo || {},
                type: 'OTP',
                description: `${group.label} verify login`,
                expiry: moment().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
                token: verifyToken,
                transaction,
                code,
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
        }

        return res.send({
            success: true,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
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
        // Schema validation
        // validate incoming post data
        const valid = Joi.validate(req.body, loginSchema);
        if (valid.error !== null) {
            return res.status(405)
                .send({
                    success: false,
                    error: 'VALIDATION_ERROR',
                    message: valid.error.details[0].message,
                });
        }

        const data = await authService.authenticate(valid.value);
        const { device, geoinfo } = req.body;
        const { token, user, newDeviceLogin } = data;
        const { group, email, first_name } = user;
        delete req.body.password;

        /**
         * If user group is "admin",
         * allow user to log in, otherwise perform verify login
         */
        const isAdmin = group.channel === 'admin';

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
            newDeviceLogin,
        };
        const verifyToken = jwt.sign(payload, jwtSecret, {
            expiresIn: '15m',
        });

        // generate otp code
        const code = rn({
            min: 100000,
            max: 999999,
            integer: true,
        });
        const authRecord = {
            type: 'OTP',
            user_id: user.id,
            device: device || {},
            geoinfo: geoinfo || {},
            description: `${group.label} verify login`,
            expiry: moment().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
            token: verifyToken,
            transaction,
            code,
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
async function socialLogin(req, res) {
    try {
        // validate post data
        if ((!req.body.googleId && !req.body.userID) || !req.body.email) {
            throw new Error('Authentication failed.');
        }

        const data = await authService.socialAuth(req.body);
        const { device, geoinfo } = req.body;
        const { user, newDeviceLogin } = data;
        const { group, email, first_name } = user;

        // admin users are not allowed social login
        if (group.name === 'admin') {
            throw new Error('Access denied.');
        }

        // log user activity
        const transaction = `${group.name}.social.login.verify`;
        await activityService.addActivity({
            user_id: user.id,
            action: transaction,
            description: `${group.label} verify social login`,
            data: req.body,
            ip: (geoinfo && geoinfo.IPv4) ? geoinfo.IPv4 : null,
            section: 'Auth',
            subsection: 'Verify Social Login',
            data: req.body,
        });

        // auth (jwt) token
        const payload = {
            email,
            id: user.id,
            time: new Date(),
            newDeviceLogin,
        };
        const verifyToken = jwt.sign(payload, jwtSecret, {
            expiresIn: '15m',
        });

        // generate otp code
        const code = rn({
            min: 100000,
            max: 999999,
            integer: true,
        });
        const authRecord = {
            user_id: user.id,
            device: device || {},
            geoinfo: geoinfo || {},
            type: 'OTP',
            description: `${group.label} verify login`,
            expiry: moment().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
            token: verifyToken,
            transaction,
            code,
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
    const { mobile, phone_country } = data;
    if (phone_country.iso === 'ZA') {
        if (mobile.indexOf('0') === 0) {
            return phone_country.phone_code + mobile.substr(1);
        }
        if (mobile.indexOf('+27') === 0) {
            return phone_country.phone_code + mobile.substr(3);
        }
        if (mobile.indexOf('27') === 0) {
            return phone_country.phone_code + mobile.substr(2);
        }
    }
    return phone_country.phone_code + mobile;
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
        // Schema validation
        // validate incoming post data
        // const valid = Joi.validate(req.body, registerSchema);
        // if (valid.error !== null) {
        //     return res.status(405)
        //         .send({
        //             success: false,
        //             error: 'VALIDATION_ERROR',
        //             message: valid.error.details[0].message,
        //         });
        // }

        const {
            username,
            last_name,
            first_name,
            referral_id,
            country,
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

        // validate country of residence
        if (!req.body.country) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Country of residence is required.'
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

        const mobile = cleanMobile(req.body);
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

        const code = generator.generate({ length: 4, numbers: true }).toUpperCase();
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
            username: username || mobile,
            sponsor: sponsorId,
            group_id: groupId,
            password,
            salt,
            verification: null,
            nationality: (country && country.iso) || null,
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

            // create user cbi wallet
            await accountService.create({
                name: 'cbi-wallet',
                label: 'CBI Wallet',
                reference: newUser.referral_id,
                is_primary: true,
                user_id: newUser.id,
            });

            // create primary email address record
            await emailAddressService.create({
                user_id: newUser.id,
                email: email,
                is_primary: true,
                is_verified: false,
            });

            // create primary mobile number record
            await mobileNumberService.create({
                user_id: newUser.id,
                number: mobile,
                is_primary: true,
                is_verified: false,
            });

            // create (default) notification record for the user
            const notifications = [];
            notifications.push({
                user_id: newUser.id,
                key: 'marketing-communication',
                activity: 'Marketing & Communication',
                description: 'Get the latest promotions, updates and tips',
                sms: marketing || false,
                email: marketing || false,
                push: marketing || false,
            });
            notifications.push({
                user_id: newUser.id,
                key: 'account-activity-updates',
                activity: 'Account Activity & Updates',
                description: 'Get notified about your account activity and updates. Choose the type(s) of notification to get notified with.',
                sms: true,
                email: true,
                push: true,
            });
            await notificationService.create(notifications);

            // notify upline once referral has registered
            if (sponsor && sponsor.id) {
                await emailHandler.notifyReferrer({
                    first_name: sponsor.first_name,
                    email: sponsor.email,
                    referral: `${first_name} ${last_name} - ${newUser.referral_id}`,
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
 * Social Register
 * Register a user with socials. A successful registration will return 
 * the user’s details and a token that can be used for subsequent requests.
 * @param {object} req 
 * @param {object} res 
 */
async function socialRegister(req, res) {
    try {
        const {
            last_name,
            first_name,
            referral_id,
            geoinfo,
            timezone,
        } = req.body;

        // validate email address
        if (!req.body.email) {
            return res.status(403).send({
                success: false,
                message: 'Registration failed. Email address is required.'
            });
        }

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

        const userPwd = generator.generate({ length: 8 }).toUpperCase();
        const code = generator.generate({ length: 4, numbers: true }).toUpperCase();
        const token = jwt.sign({
            code,
            email,
        }, jwtSecret, {
            expiresIn: '30m'
        });

        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(userPwd, salt);
        const user = {
            salt,
            email,
            password,
            mobile: null,
            username: email,
            group_id: groupId,
            verification: null,
            sponsor: sponsorId,
            timezone: timezone || null,
            last_name: last_name || null,
            first_name: first_name || null,
            nationality: (geoinfo && geoinfo.country_code) || null,
            metadata: {
                geoinfo,
            }
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
            console.log("========================Test Change Password=======================")
            // notify upline once referral has registered
            if (sponsor && sponsor.id) {
                await emailHandler.notifyReferrer({
                    first_name: sponsor.first_name,
                    email: sponsor.email,
                    referral: `${first_name} ${last_name} - ${newUser.referral_id}`,
                });
            }

            // send activation email (if is not a lead)
            if (!isLead) {
                await emailHandler.confirmEmail({
                    userPassword: userPwd,
                    socialSignup: true,
                    first_name,
                    email,
                    token,
                });
            }

            // create user cbi wallet
            await accountService.create({
                is_primary: true,
                name: 'cbi-wallet',
                label: 'CBI Wallet',
                user_id: newUser.id,
                reference: newUser.referral_id,
            });

            // create primary email address record
            await emailAddressService.create({
                email: email,
                is_primary: true,
                is_verified: false,
                user_id: newUser.id,
            });

            // create (default) notification record for the user
            await notificationService.create({
                user_id: newUser.id,
                activity: 'Marketing & Communication',
                description: 'Get the latest promotions, updates and tips',
                sms: false,
                email: false,
                push: false,
            });

            // response
            return res.send({
                success: true,
                lead: isLead,
            });
        } else {
            throw new Error('Request could not be processed, please try again or contact support.');
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
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
        return res.status(500).send({
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
        return res.status(500).send({
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
        const { old_password, new_password1, new_password2, geoinfo, device } = req.body;
        const user = await userService.show(req.user.id);

        if (old_password === new_password1) {
            return res.send({
                success: false,
                message: 'Validation error. Old and new password cannot be the same.'
            });
        }

        if (!bcrypt.compareSync(old_password, user.password)) {
            return res.send({
                success: false,
                message: 'Validation error. Incorrect old password.'
            });
        }

        if (new_password1 !== new_password2) {
            return res.send({
                success: false,
                message: 'Validation error. Passwords do not match.'
            });
        }

        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(new_password1, salt);

        // Validation: enforce a Password History to 24
        const samePassword = await passwordService.show({
            user_id: user.id,
            password: new_password1,
        });
        if (samePassword && samePassword.id) {
            return res.send({
                success: false,
                message: 'You have already used that password, try another'
            });
        }

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

        // check if passwords history records have reached 24
        const prevPasswords = await passwordService.index({ user_id: user.id });
        if (prevPasswords.length === 24) {
            const deletePassword = prevPasswords[prevPasswords.length - 1];
            await passwordService.destroy({
                id: deletePassword.id,
            });
        }

        // log old password into passwords history
        await passwordService.create({
            password: old_password,
            user_id: user.id,
        });

        // send email notification
        await emailHandler.changePassword({
            first_name: user.first_name,
            email: user.email,
        });

        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request2'
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
            return res.send({
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
            email: true
        };

        await userService.update(user.id, {
            verification,
            // verify_token: token,
            updated: sequelize.fn('NOW'),
        });

        // send reset password email
        const { first_name } = user;
        await emailHandler.resetPassword({
            first_name,
            email,
            token,
            admin_baseurl: req.body.baseurl ? req.body.baseurl : '',
        });

        return res.send({
            success: true,
            message: 'Password was successfully sent via email'
        });
    } catch (error) {
        console.log('error', error.message)
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
        const { password1, password2, device, geoinfo } = req.body;

        const user = await userService.findByEmail(req.user.email);

        if (!user || !user.verification || !user.verification.token) {
            return res.status(405).send({
                success: false,
                message: 'Access denied.'
            });
        }

        if (password1 !== password2) {
            return res.status(403).send({
                success: false,
                message: 'Validation error. Passwords do not match.'
            });
        }

        const salt = bcrypt.genSaltSync();
        const password = bcrypt.hashSync(password1, salt);

        // Validation: enforce a Password History to 24
        const samePassword = await passwordService.show({
            user_id: user.id,
            password: password1,
        });
        
        if (samePassword && samePassword.id) {
            return res.status(403).send({
                success: false,
                message: 'You have already used the specified password, please enter a different password.'
            });
        }

        delete user.verification.token;
        await userService.update(user.id, {
            salt,
            password,
            locked: false,
            login_attempts: 0,
            updated: sequelize.fn('NOW'),
            verification: { ...user.verification, email: false}
        });

        // audit trail / activity logging
        await activityService.addActivity({
            user_id: user.id,
            action: `${user.group.name}.password.change`,
            description: `${user.group.label} changed password`,
            ip: (geoinfo && geoinfo.IPv4) ? geoinfo.IPv4 : null,
            section: 'Account',
            subsection: 'Change password',
            data: { device },
        });

        // insert new password into passwords
        await passwordService.create({
            user_id: user.id,
            password: password1,
        });

        // send email notification
        await emailHandler.changePassword({
            first_name: user.first_name,
            email: user.email,
        });

        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
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
        return res.status(500).send({
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
        return res.status(500).send({
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
        return res.status(500).send({
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
        return res.status(500).send({
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
        const { id } = req.user;
        const data = await authService.findUser({ id }, ['mfa']);
        return res.send({
            success: true,
            data
        });
    } catch (error) {
        return res.status(500).send({
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
        return res.status(500).send({
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
        return res.status(500).send({
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
        return res.status(500).send({
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
        return res.status(500).send({
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
        return res.status(500).send({
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
        return res.status(500).send({
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
        return res.status(500).send({
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
        const user = await userService.show(req.user.id);
        const { email } = user;
        const formattedKey = authenticator.generateKey();
        const formattedToken = authenticator.generateToken(formattedKey);
        const result = authenticator.verifyToken(formattedKey, formattedToken);
        const totpUri = authenticator.generateTotpUri(formattedKey, email, 'CBI Global', 'SHA1', 6, 30);
        return res.send({
            success: true,
            formattedKey,
            formattedToken,
            result,
            totpUri,
        });
    } catch (error) {
        return res.status(500).send({
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
        return res.status(500).send({
            auth: false,
            message: 'Could not process request. Authentication failed'
        });
    }
}

async function otp(req, res) {
    try {
        // get user
        const user = await userService.show(req.user.id);

        // destroy all old OTP records
        await otpService.destroyAll({
            user_id: user.id,
        });

        // create/log OTP record
        const otpRecord = {
            ...req.body,
            user_id: user.id,
        };
        const otp = await otpService.create(otpRecord);

        // send OTP auth
        if (otp.code) {
            const mobile = user.mobile.replace('+', '');
            await sendOTPAuth(mobile, otp.code);
        }

        // response
        return res.send({ success: true });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process request. Authentication failed'
        });
    }
}

async function otpResend(req, res) {
    try {
        // get user
        const { transaction } = req.body;
        let user = null;
        if (transaction === 'activation') {
            user = await userService.findByEmail(req.user.email, {
                archived: false,
                blocked: false,
                verified: false,
            });
        } else {
            user = await userService.show(req.user.id);
        }

        if (!user) {
            return res.status(500).send({
                success: false,
                message: 'Access denied'
            });
        }

        // destroy all old OTP records
        await otpService.destroyAll({
            user_id: user.id,
        });

        // create/log OTP record
        const otpRecord = {
            ...req.body,
            user_id: user.id,
        };
        const otp = await otpService.create(otpRecord);

        // send OTP auth
        if (otp.code) {
            const mobile = user.mobile.replace('+', '');
            await sendOTPAuth(mobile, otp.code);
        }

        // response
        return res.send({ success: true });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process request. Authentication failed'
        });
    }
}

async function otpVerify(req, res) {
    try {
        // get otp record
        const { code, transaction } = req.body;
        const otpFilters = { code, transaction };

        if (transaction === 'activation') {
            otpFilters.type = transaction;
            otpFilters.transaction = 'member.register.verify';
        }

        const otp = await otpService.show(otpFilters);

        if (otp && otp.id) {
            // destroy all old OTP records
            await otpService.destroyAll({
                user_id: req.user.id,
            });

            if (transaction === 'activation') {
                const data = await authService.tokensVerify({
                    ...req.user,
                    ...otpFilters,
                });
                return res.send(data);
            }
            return res.send({ success: true });
        }

        return res.send({ success: false });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process request. Authentication failed'
        });
    }
}

module.exports = {
    validate,
    tokensVerify,
    migrateConfirm,
    tokensValidate,
    tokensVerifyResend,
    resendActivationEmail,
    validateMigrateEmail,
    validateMigrateToken,
    migrateTokenResend,
    migrateMobileConfirm,
    login,
    socialLogin,
    register,
    socialRegister,
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
    otp,
    otpResend,
    otpVerify,
}
