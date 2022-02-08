const { sendMail } = require('../utils');
const emailTemplates = require('../lib/emailTemplates');
const config = require('../config');
const { smtp } = config.mail;
const { baseurl } = config;

async function confirmEmail(data) {
    const { email, token } = data;
    data.link = `${baseurl.frontend}/activate/${token}`;
    const template = emailTemplates.confirmEmail(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'Confirm your email address', template);
};

async function resetPassword(data) {
    const { email, token, admin_baseurl } = data;
    data.link = admin_baseurl ? `${baseurl.admin}/reset-password/${token}` : `${baseurl.frontend}/reset-password/${token}`;
    const template = emailTemplates.resetPassword(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'Reset password', template);
};

async function welcome(data) {
    const { email } = data;
    data.url = `${baseurl.frontend}/login`;
    const template = emailTemplates.welcome(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'Welcome to CBI Global!', template);
};

async function changePassword(data) {
    const { email } = data;
    const template = emailTemplates.changePassword(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'Password changed successfully!', template);
};

async function verifyLogin(data) {
    const { email } = data;
    const template = emailTemplates.verifyLogin(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'Verify login - Do not share this sign-in confirmation code with anyone', template);
};

async function notifyReferrer(data) {
    const { email } = data;
    const template = emailTemplates.notifyReferrer(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'You have a new referral!', template);
};

async function loginNotify(data) {
    const { email } = data;
    const template = emailTemplates.loginNotify(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'Sign-in Notification', template);
};

module.exports = {
    confirmEmail,
    resetPassword,
    verifyLogin,
    notifyReferrer,
    changePassword,
    loginNotify,
    welcome,
};