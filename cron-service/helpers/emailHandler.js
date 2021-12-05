const { sendMail } = require('../utils');
const emailTemplates = require('../lib/emailTemplates');
const config = require('../config');
const { smtp } = config.mail;

async function autoRenewExpiryNotify(data) {
    const { email } = data;
    const template = emailTemplates.autoRenewExpiryNotify(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'Reminder: CBI Wealth Creator membership expires soon!', template);
};

async function autoRenewNotify(data) {
    const { email, txid } = data;
    const template = emailTemplates.autoRenewNotify(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, `Wealth Creator renewal confirmation - Ref: #${txid}`, template);
};

module.exports = {
    autoRenewExpiryNotify,
    autoRenewNotify,
};