const axios = require('axios');
const config = require('../config');

const { baseurl } = config;
const permakey = 'plan-2-bronze';
const url = `${baseurl}cron/products/${permakey}/weekly/earnings`;
const headers = {
    'Content-Type': 'application/json',
};
return axios({
    url,
    mode: 'no-cors',
    method: 'GET',
    headers,
});