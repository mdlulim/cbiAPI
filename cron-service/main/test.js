const axios = require('axios');
const { sendSms } = require('../helpers/smsHandler');

sendSms(['27783594927'], 'Hi there, Thembinkosi Klein! This is a test Cron from CBI Global')
    .then(json => json.data)
    .then(res => console.log(res))
    .catch(err => console.error(err));