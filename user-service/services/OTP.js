const sequelize = require('../config/db');
const { OTPAuth } = require('../models/OTPAuth');
const moment = require('moment');
const rn = require('random-number');

async function create(data) {
    try {
        const code = rn({
            min: 1000,
            max: 9999,
            integer: true,
        });
        data.type = 'OTP';
        data.code = code;
        data.expiry = moment().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        return OTPAuth.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function validate(data) {
    try {
        const {
            token,
            transaction,
            user_id,
        } = data;
        const otp = await OTPAuth.findOne({
            where: {
                token,
                transaction,
                user_id,
                expiry: {
                    [Op.gt]: sequelize.fn('NOW'),
                }
            }
        });
        if (otp && otp.id) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    validate,
}