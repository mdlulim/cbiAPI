const moment = require('moment');
const axios  = require('axios');
const config = require('../config');
const { smsApi } = config;

/**
 * SMS Configurations
 */
const smsUrl = `${smsApi.baseUrl + smsApi.servicePlanID}/batches`;
const smsHeaders = {
    'Authorization': `Bearer ${smsApi.apiKey}`,
    'Content-Type': 'application/json',
};

/**
 * Send SMS
 * @param {array} recipients 
 * @param {string} message 
 */
function sendSms(recipients, message) {
    console.log(smsUrl)
    return axios({
        mode: 'no-cors',
        method: 'POST',
        url: smsUrl,
        headers: smsHeaders,
        data: {
            from: smsApi.senderID,
            to: recipients,
            body: message,
        },
    });
};

const sendOTPAuth = async (number, otp) => {
    console.log('mobile number 02 = '+number);
    const message = `Your CBI OTP is ${otp} requested on ${moment().format('DD MMM YYYY')} at ${moment().format('HH:mm')}. This OTP expires in 15 minutes. Please contact CBI support for help.`;
    return sendSms([number], message);
}

const sendVerifyAuth = async (number, message) => {
    return sendSms([number], message);
}

const sendWelcomeAuth = async (number, message) => {
    return sendSms([number], message);
}

module.exports = {
    sendOTPAuth,
    sendVerifyAuth,
    sendWelcomeAuth,
};
