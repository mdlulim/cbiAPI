const csv = require('csvtojson');
const sequelize = require('../config/db');
const { OldSystemClient } = require('../models/OldSystemClient');
const array = [];

async function bulkCreate(data) {
    return OldSystemClient.bulkCreate(data, {
        ignoreDuplicates: true,
    });
}

async function bulkUpdate(query) {
    return sequelize.query(query);
}

return;
const file = './clients.csv';
csv()
    .fromFile(file)
    .then(async json => {
        let sql = '';
        json.map(async item => {
            const {
                fdec36e_client_affiliate_key,
                fdec36e_client_affiliate_id,
                fdec36e_clientele_username,
                fdec36e_clientele_country,
                fdec36e_clientele_first_name,
                fdec36e_clientele_last_name,
                fdec36e_clientele_email,
                fdec36e_clientele_phone_code,
                fdec36e_clientele_type,
                fdec36e_clientele_phone,
                fdec36e_clientele_gender,
                fdec36e_clientele_id,
                fdec36e_clients_aweber_error_text,
            } = item;

            if (fdec36e_clients_aweber_error_text.includes('blocked')) {
                sql += `
                UPDATE old_system_clients 
                SET blocked = true, blocked_reason = '${fdec36e_clients_aweber_error_text}'
                WHERE ref_id = '${fdec36e_clientele_id}'`;
            }

            array.push({
                email: fdec36e_clientele_email,
                username: fdec36e_clientele_username,
                last_name: fdec36e_clientele_last_name,
                first_name: fdec36e_clientele_first_name,
                country_name: fdec36e_clientele_country,
                phone_code: fdec36e_clientele_phone_code,
                affiliate_key: fdec36e_client_affiliate_key,
                affiliate_id: fdec36e_client_affiliate_id,
                gender: fdec36e_clientele_gender,
                phone: fdec36e_clientele_phone,
                type: fdec36e_clientele_type,
                ref_id: fdec36e_clientele_id,
            });
        });
        await bulkUpdate(sql);
        // console.log(json[0]);
        // await bulkCreate(array);
        // console.log('completed!');
    });