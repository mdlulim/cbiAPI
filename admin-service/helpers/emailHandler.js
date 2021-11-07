const { sendMail } = require('../utils');
const emailTemplates = require('../lib/emailTemplates');
const config = require('../config');
const { smtp } = config.mail;

async function newUser(data) {
    const { email } = data;
    const template = emailTemplates.newUser(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Welcome to CBI', template);
};

module.exports = {
    newUser,
};