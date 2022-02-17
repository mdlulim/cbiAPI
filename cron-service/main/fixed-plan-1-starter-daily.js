const axios = require('axios');
const config = require('../config');

const { baseurl } = config;
const permakey = 'plan-1-starter';
const url = `${baseurl}cron/products/${permakey}/daily/earnings`;
const headers = {
    'Content-Type': 'application/json',
};
return axios({
    url,
    headers,
    mode: 'no-cors',
    method: 'GET',
});