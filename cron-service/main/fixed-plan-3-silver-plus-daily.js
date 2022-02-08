const axios = require('axios');
const config = require('../config');

const { baseurl } = config;
const permakey = 'plan-3-silver-plus';
const url = `${baseurl}cron/products/${permakey}/daily/earnings`;
const headers = {
    'Content-Type': 'application/json',
};
return axios({
    url,
    mode: 'no-cors',
    method: 'GET',
    headers,
});