const sequelize = require('../config/db');
const { EmailAddress } = require('../models/EmailAddress');
const { User } = require('../models/User');
const { Group } = require('../models/Group');
const { OTPAuth } = require('../models/OTPAuth');
const emailHandler = require('../helpers/emailHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const config = require('../config');
const {
    baseurl,
    jwtSecret,
    tokenExpireHours,
    tokenExpireTime,
} = config;

User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });

async function createOtp(data) {
    return OTPAuth.create(data);
}

async function deleteOtp(user_id) {
    return OTPAuth.destroy({ where: { user_id } });
}

module.exports = {
    createOtp,
    deleteOtp,
}
