const { sendMail } = require('../utils');
const emailTemplates = require('../lib/emailTemplates');
const config = require('../config');
const { smtp } = config.mail;

async function bulkStatus(data) {
    const { email } = data;
    const template = emailTemplates.batchEmail(data);
    const from = {
        name: 'CBI',
        email: smtp.auth.user,
    };
    return sendMail(from, email, 'CBI - Batch Processing', template);
};


module.exports = {
    bulkStatus,
};