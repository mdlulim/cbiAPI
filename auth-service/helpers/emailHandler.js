const { sendMail } = require('../utils');
const emailTemplates = require('../lib/emailTemplates');
const config = require('../config');
const { smtp } = config.mail;

async function verifyLogin(data) {
    const { email } = data;
    const template = emailTemplates.verifyLogin(data);
    const from = {
        name: 'CBI',
        email: smtp.user,
    };
    return sendMail(from, email, 'Crypto Based Innovation - Verify Login', template);
};

module.exports = {
    verifyLogin,
};