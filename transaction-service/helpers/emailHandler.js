const { sendMail } = require('../utils');
const emailTemplates = require('../lib/emailTemplates');
const config = require('../config');
const { smtp } = config.mail;

async function cryptoDepositRequestNotification(data) {
    const { email } = data;
    const template = emailTemplates.cryptoDepositRequestNotification(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Pending Buy Request Notification', template);
};

async function depositRequestNotification(data) {
    const { email } = data;
    const template = emailTemplates.depositRequestNotification(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Buy Request Notification', template);
};

async function transferSendNotification(data) {
    const { email } = data;
    const template = emailTemplates.transferSendNotification(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Transfer Notification', template);
};

async function transferReceiptNotification(data) {
    const { email } = data;
    const template = emailTemplates.transferReceiptNotification(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Transaction Notification', template);
};

module.exports = {
    cryptoDepositRequestNotification,
    depositRequestNotification,
    transferSendNotification,
    transferReceiptNotification,
};