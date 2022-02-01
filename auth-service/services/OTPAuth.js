const sequelize = require('../config/db');
const moment = require('moment');
const rn = require('random-number');
const { OTPAuth } = require('../models/OTPAuth');
const { Setting } = require('../models/Setting');
const { User } = require('../models/User');

OTPAuth.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        // retrieve otp validity record (from settings)
        const setting = await Setting.findOne({
            attributes: ['value'],
            where: {
                category: 'system',
                subcategory: 'config',
                key: 'otp_validity',
            },
        });
        const code = rn({
            min: 100000,
            max: 999999,
            integer: true,
        });
        data.type = 'OTP';
        data.code = code;
        data.expiry = moment().add(setting.value || 15, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        return OTPAuth.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show({ code, transaction }) {
    try {
        const { fn, Op } = sequelize;
        const where = {
            code,
            transaction,
            status: { [Op.iLike]: 'Pending' },
            expiry: {
                [Op.gte]: fn('NOW')
            }
        };
        return OTPAuth.findOne({ where });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function find(condition) {
    try {
        return OTPAuth.findOne({ where: condition });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroyAll(condition) {
    try {
        return OTPAuth.destroy({ where: condition });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    show,
    find,
    destroyAll,
}