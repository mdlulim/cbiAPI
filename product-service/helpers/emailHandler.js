const { sendMail } = require('../utils');
const emailTemplates = require('../lib/emailTemplates');
const config = require('../config');
const { smtp } = config.mail;

async function tokenPurchaseConfirmation(data) {
    const {
        email, 
        tokens,
        product,
    } = data;
    const template = emailTemplates.tokenPurchaseConfirmation(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, `CBI - You have bought ${tokens} ${product.title}!`, template);
};

async function wealthCreatorConfirmation(data) {
    const { email } = data;
    const template = emailTemplates.wealthCreatorConfirmation(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - You have subscribed to a Wealth Creator Membership!', template);
};

async function productPurchaseConfirmation(data) {
    const { email, product } = data;
    const template = emailTemplates.productPurchaseConfirmation(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, `CBI - You have successfully bought ${product.title}!`, template);
};

module.exports = {
    tokenPurchaseConfirmation,
    wealthCreatorConfirmation,
    productPurchaseConfirmation,
};