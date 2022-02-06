const moment = require('moment');
const axios  = require('axios');
const config = require('../config');
const { smsApi } = config;

/**
 * SMS Configurations
 */
const { provider } = smsApi;

/**
 * Send SMS
 * @param {array} recipients 
 * @param {string} message 
 */
function sendSms(recipients, message) {
    if (provider === 'sinch') {
        let data = smsApi[provider];
        let smsUrl = `${data.baseUrl + data.servicePlanID}/batches`;
        let smsHeaders = {
            'Authorization': `Bearer ${data.apiKey}`,
            'Content-Type': 'application/json',
        };
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
    }
    if (provider === 'expertTexting') {
        let data = smsApi[provider];
        let smsUrl = `${data.baseUrl}Message/Send`;
        let smsHeaders = {
            'Content-Type': 'application/json',
        };

        smsUrl += `?username=${data.username}`;
        smsUrl += `&api_key=${data.apiKey}`;
        smsUrl += `&api_secret=${data.apiSecret}`;
        smsUrl += `&from=${data.senderID}`;
        smsUrl += `&to=${recipients.join('')}`;
        smsUrl += `&text=${message}`;
        smsUrl += `&type=text`;
        return axios({
            mode: 'no-cors',
            method: 'POST',
            url: smsUrl,
            headers: smsHeaders,
        });
    }
};

const sendOTPAuth = async (number, otp) => {
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
