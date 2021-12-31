const sequelize = require('../config/db');
const moment = require('moment');
const rn = require('random-number');
const { OTPAuth } = require('../models/OTPAuth');
const { User } = require('../models/User');

OTPAuth.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        const code = rn({
            min: 1000,
            max: 9999,
            integer: true,
        });
        data.type = 'OTP';
        data.code = code;
        data.user_id = data.user.id
        data.transaction = data.user.first_name+'.bankAccount.verify';
        data.expiry = moment().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        await OTPAuth.create(data);
        return {success: true, data: data}
    } catch (error) {
        console.error(error || null);
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
    destroyAll,
}