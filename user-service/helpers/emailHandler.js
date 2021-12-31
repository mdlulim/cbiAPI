const { sendMail } = require('../utils');
const emailTemplates = require('../lib/emailTemplates');
const config = require('../config');
const { smtp } = config.mail;

async function autoRenewStatusChange(data) {
    const { email } = data;
    const template = emailTemplates.autoRenewStatusChange(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Your Profile has been successfully updated!', template);
};

async function kycNotification(data) {
    const { email } = data;
    const template = emailTemplates.kycNotification(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - KYC Approval ', template);
};

async function updateNotification(data) {
    const { email, subject } = data;
    const template = emailTemplates.updateNotification(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, `CBI - ${subject}`, template);
};


module.exports = {
    autoRenewStatusChange,
    kycNotification,
    updateNotification,
};