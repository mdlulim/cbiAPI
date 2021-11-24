const authController = require('./controllers/Auth');
const authMiddleware = require('./middlewares/auth');

/**
 * Authorization Service
 * 
 * CBI uses a token-based HTTP Authentication scheme.
 * Once a user has logged in and received a token, each
 * subsequent request should include the token in the
 * HTTP Authorization header.
 * 
 * Tokens expire 6 hours after creation. Once a token
 * has expired, login is required in order to re-authenticate.
 * CBI’s tokens allow for a single user to have multiple
 * active tokens on separate devices as well as the ability
 * for admin users to create tokens that do not expire.
 * 
 * For security reasons CBI will only expose the token once,
 * on login or on register, and never again. Be sure to
 * store it somewhere safe.
 * 
 * @param {*} app 
 */
module.exports.set = app => {

    /**
     * Validate
     */
    app.post('/validate/:prop/:value', authController.validate);

    /**
     * Verify Token
     */
    app.post('/tokens/verify', authMiddleware.checkAuth, authController.tokensVerify);

    /**
     * Login
     * 
     * Login a user with the credentials provided.
     * A successful login will return the user’s
     * details and a token that can be used for
     * subsequent requests.
     */
    app.post('/login', authController.login);

    /**
     * Social Login
     * 
     * Login a user with the social logins (Google, Facebook, Apple).
     * A successful login will return the user’s
     * details and a token that can be used for
     * subsequent requests.
     */
    app.post('/social/login', authController.socialLogin);

    /**
     * Authenticate Token
     */
    app.post('/refresh', authMiddleware.checkAuth, authController.refresh);

    /**
     * Register
     * 
     * Register a user with the credentials provided.
     * A successful registration will return the user’s
     * details and a token that can be used for
     * subsequent requests.
     */
    app.post('/register', authController.register);

    /**
     * Logout
     * 
     * Logs the current user out and invalidates the
     * token that was used to authenticate.
     */
    app.post('/logout', authMiddleware.checkAuth, authController.logout);

    /**
     * Logout All
     * 
     * Logs the current user out and invalidates all
     * the tokens related to the user that have
     * expiry dates.
     */
    app.post('/logout/all', authMiddleware.checkAuth, authController.logoutAll);

    /**
     * Change Password
     * 
     * Change a user’s password.
     * 
     * Authorization header required for authentication.
     */
    app.post('/password/change', authMiddleware.checkAuth, authController.passwordChange);

    /**
     * Reset Password
     * 
     * Send a password reset email.
     */
    app.post('/password/reset', authController.passwordReset);

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
    app.post('/password/reset/confirm', authMiddleware.checkAuth, authController.passwordResetConfirm);

    /**
     * Verify Email
     * 
     * Verify an email number with a key. The key is sent
     * in an email by CBI.
     */
    app.post('/email/verify', authMiddleware.checkAuth, authController.emailVerify);

    /**
     * Resend Email Verification
     * 
     * Resend email verifications for an email.
     */
    app.post('/email/verify/resend', authMiddleware.checkAuth, authController.emailVerifyResend);

    /**
     * Verify Mobile
     * 
     * Verify a mobile number with an OTP. Unlike the “Verify Email”,
     * the user needs to be logged in for this functionality to work.
     */
    app.post('/mobile/verify', authMiddleware.checkAuth, authController.mobileVerify);

    /**
     * Resend Mobile Verification
     * 
     * Resend mobile verifications for a mobile number.
     */
    app.post('/mobile/verify/resend', authMiddleware.checkAuth, authController.mobileVerifyResend);

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
    app.get('/mfa', authMiddleware.checkAuth, authController.mfa);

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
    app.post('/mfa/sms', authMiddleware.checkAuth, authController.createMfaSms);

    /**
     * Multi-factor SMS Status
     */
    app.get('/mfa/sms', authMiddleware.checkAuth, authController.mfaSms);

    /**
     * Multi-factor Enable SMS
     * 
     * By posting to this endpoint you are starting the
     * verification process for enabling SMS authentication.
     * At this point an OTP will be sent to the mobile
     * number that was posted. Use this OTP to verify the
     * mobile number at the Verify endpoint.
     */
    app.post('/mfa/sms/send', authMiddleware.checkAuth, authController.mfaSmsSend);

    /**
     * Multi-factor Disable SMS
     */
    app.delete('/mfa/sms', authMiddleware.checkAuth, authController.disableMfaSms);

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
    app.post('/mfa/token', authMiddleware.checkAuth, authController.createMfaToken);

    /**
     * Multi-factor Token Status
     */
    app.get('/mfa/token', authMiddleware.checkAuth, authController.mfaToken);

    /**
     * Multi-factor Disable Token
     */
    app.delete('/mfa/token', authMiddleware.checkAuth, authController.destroyMfaToken);

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
    app.post('/mfa/verify', authMiddleware.checkAuth, authController.mfaVerify);
};
