const axios = require('axios');
const config = require('../config');

const { baseurl } = config;
const url = `${baseurl}cron/wc-autorenew`;
const headers = {
    'Content-Type': 'application/json',
};
return axios({
    url,
    mode: 'no-cors',
    method: 'GET',
    headers,
});