const { sendMail } = require('../utils');
const emailTemplates = require('../lib/emailTemplates');
const config = require('../config');
const { smtp } = config.mail;

async function confirmEmail(data) {
    const { email, token } = data;
    data.link = `http://demo@cbiglobal.io/activate/${token}`;
    const template = emailTemplates.confirmEmail(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Confirm your email address', template);
};

async function verifyLogin(data) {
    const { email } = data;
    const template = emailTemplates.verifyLogin(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Verify login', template);
};

module.exports = {
    confirmEmail,
    verifyLogin,
};