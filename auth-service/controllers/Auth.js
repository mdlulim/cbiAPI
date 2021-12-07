const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const rn = require('random-number');
const generator = require('generate-password');
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
const errorHandler = require('../helpers/errorHandler');
const activityService = require('../services/Activity');
const sessionService = require('../services/Session');
const emailHandler = require('../helpers/emailHandler');
const { sendOTPAuth } = require('../helpers/smsHandler');

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
            data.last_name  = user.last_name;
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
        const { type } = req.body;
        if (type === 'login') {
            const data = await authService.verifyLogin({
                ...req.user,
                ...req.body
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

        if (type === 'login') {

            const user = await userService.show(req.user.id);
    
            if (!user) {
                throw new Error('Access denied.');
            }
    
            // auth (jwt) token
            const { email, group, first_name } = user;
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
                min: 1000,
                max: 9999,
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
        const data = await authService.authenticate(req.body);
        const { device, geoinfo } = req.body;
        const { token, user, newDeviceLogin } = data;
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
            newDeviceLogin,
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
        const code    = generator.generate({ length: 4, numbers: true }).toUpperCase();
        const token   = jwt.sign({
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
            return res.status(403).send({
                success: false,
                message: 'Validation error. Old and new password cannot be the same.'
            });
        }

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
            // verify_token: token,
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
        console.log('error', error.message)
        return res.status(500).send({
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

        console.log(req.user)

        const user = await userService.findByEmail(req.user.email);

        if (!user) {
            return res.status(403).send({
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
            ip: (geoinfo && geoinfo.IPv4) ? geoinfo.IPv4 : null,
            section: 'Account',
            subsection: 'Change password',
            data: { device },
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

async function otpVerify(req, res) {
    try {
        // get otp record
        const { code, transaction } = req.body;
        const otp = await otpService.show({
            code,
            transaction,
        });

        if (otp && otp.id) {
            // destroy all old OTP records
            await otpService.destroyAll({
                user_id: req.user.id,
            });
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
    tokensVerifyResend,
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
