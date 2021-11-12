const { sendMail } = require('../utils');
const emailTemplates = require('../lib/emailTemplates');
const config = require('../config');
const { smtp } = config.mail;

async function depositRequestNotification(data) {
    const { email } = data;
    const template = emailTemplates.depositRequestNotification(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Deposit Request Notification', template);
};

module.exports = {
    depositRequestNotification,
};