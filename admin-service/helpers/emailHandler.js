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

async function kycNotification(data) {
    const { email } = data;
    const template = emailTemplates.kycNotification(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - KYC Approval ', template);
};

async function depositRequestNotification(data) {
    const { email } = data;
    const template = emailTemplates.depositRequestNotification(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Deposit Request Notification', template);
};

async function updatingUserStatus(data) {
    const { email } = data;
    const template = emailTemplates.updatingUserStatus(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Membership Status Notification', template);
};
async function transactionNotification(data) {
    console.log(data)
    const { email } = data;
    const template = emailTemplates.transactionNotification(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Transaction Notification', template);
};

async function approveMembership(data) {
    const { email } = data;
    const template = emailTemplates.approveMembership(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Membership Approval Notification', template);
};

async function memberCommissionFee(data) {
    const { email } = data;
    const template = emailTemplates.memberCommissionFee(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Membership Commission Fee', template);
};

module.exports = {
    newUser,
    kycNotification,
    updatingUserStatus,
    approveMembership,
    transactionNotification,
    memberCommissionFee
};