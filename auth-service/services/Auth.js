const sequelize = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config');

const { User } = require('../models/User');
const { Group } = require('../models/Group');
const { OTPAuth } = require('../models/OTPAuth');

User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });
OTPAuth.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function createOtp(data) {
    return OTPAuth.create(data);
}

async function deleteOtp(user_id) {
    return OTPAuth.destroy({ where: { user_id } });
}

async function authenticate(data) {
    const { user, password } = data;
    const { Op } = sequelize;
    return User.findOne({
        where: {
            [Op.or]: [
                { email: user },
                { mobile: user },
                { username: user },
            ],
            archived: false,
        },
        include: [{ model: Group }],
    }).then(async record => {
        if (!record)
            throw new Error('Authentication failed. User not found.');
        if (!bcrypt.compareSync(password, record.password)) {
            const loginAttemps = record.login_attempts + 1;
            const blocked = (loginAttemps > 3);
            await User.update({
                blocked,
                login_attempts: loginAttemps,
                updated: new Date().toISOString(),
            }, { where: { id: record.id } });
            if (blocked) {
                throw new Error('Authentication failed. Account blocked, please contact support.');
            }
            throw new Error(`Authentication failed. Wrong username and/or password. You have ${3 - loginAttemps} login attemp(s) remaining.`);
        }
        if (record.blocked)
            throw new Error('Authentication failed. Account blocked, please contact support.');
        if (!record.verified)
            throw new Error('Authentication failed. User pending verification.');
        if (record.status.toLowerCase() !== 'active')
            throw new Error('Authentication failed. User pending verification.');

        const {
            id,
            email,
            group,
            mobile,
            profile,
            language,
            group_id,
            username,
            last_name,
            first_name,
            birth_date,
            nationality,
            timezone,
            metadata,
            prompt_change_password,
            permissions,
            id_number,
            last_login,
            created,
            updated,
        } = record;
        const payload = {
            id,
            username,
            group_id,
            last_name,
            first_name,
            group_name: group.name,
            time: new Date()
        };
        var token = jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.tokenExpireTime
        });
        return {
            token,
            user: {
                id,
                group,
                email,
                mobile,
                profile,
                username,
                last_name,
                first_name,
                birth_date,
                nationality,
                permissions,
                last_login,
                id_number,
                language,
                timezone,
                metadata,
                group_id,
                created,
                updated,
                prompt_change_password,
            }
        };
    });
}

async function verify(data) {
    const { id, password } = data;
    const user = await User.findOne({
        where: { id },
        include: [{ model: Group }],
    });
    if (!user)
        throw new Error('Authentication failed. User not found.');
    if (!bcrypt.compareSync(password, user.password))
        throw new Error('Authentication failed. Wrong password.');

    return { success: true };
}

/**
 * Logout
 * 
 * Logs the current user out and invalidates the
 * token that was used to authenticate.
 * 
 * @param {string} id 
 * @returns 
 */
async function logout(id) {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Logout All
 * 
 * Logs the current user out and invalidates all
 * the tokens related to the user that have
 * expiry dates.
 */
async function logoutAll() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Change Password
 * 
 * Change a user’s password.
 * 
 * Authorization header required for authentication.
 * 
 * @param {string} id 
 * @param {string} password 
 * @param {string} salt
 * @returns 
 */
async function passwordChange(id, password, salt) {
    try {
        await User.update({
            salt,
            password,
            updated: sequelize.fn('NOW')
        }, { where: { id } });
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
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
async function passwordResetConfirm() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Verify Email
 * 
 * Verify an email number with a key. The key is sent
 * in an email by CBI.
 */
async function emailVerify() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Resend Email Verification
 * 
 * Resend email verifications for an email.
 */
async function emailVerifyResend() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Verify Mobile
 * 
 * Verify a mobile number with an OTP. Unlike the “Verify Email”,
 * the user needs to be logged in for this functionality to work.
 */
async function mobileVerify() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Resend Mobile Verification
 * 
 * Resend mobile verifications for a mobile number.
 */
async function mobileVerifyResend() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
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
async function mfa() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
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
async function createMfaSms() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Multi-factor SMS Status
 */
async function mfaSms() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
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
async function mfaSmsSend() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Multi-factor Disable SMS
 */
async function disableMfaSms() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
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
async function createMfaToken() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Multi-factor Token Status
 */
async function mfaToken() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Multi-factor Disable Token
 */
async function destroyMfaToken() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
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
async function mfaVerify() {
    try {
        return res.send({
            success: true,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    createOtp,
    deleteOtp,
    authenticate,
    verify,
    logout,
    logoutAll,
    passwordChange,
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
