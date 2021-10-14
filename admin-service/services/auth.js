const sequelize = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Users = require('../models/user').User;
const Roles = require('../models/userRole').Role;
const Companies = require('../models/company').Company;
const config = require('../config');

Users.belongsTo(Roles, { foreignKey: 'role_id', targetKey: 'id' });

const authenticate = params => {
    return Users.findOne({
        where: {
            [sequelize.Op.or]: [
                { email: params.user },
                { mobile: params.user },
                { username: params.user },
            ],
            archived: false,
        },
        include: [{ model: Roles }],
   }).then(user => {
        if (!user)
            throw new Error('Authentication failed. User not found.');
        if (!bcrypt.compareSync(params.password, user.password))
            throw new Error('Authentication failed. Wrong username and/or password.');
        if (user.blocked)
            throw new Error('Authentication failed. Account blocked, please contact support.');
        if (!user.verified)
            throw new Error('Authentication failed. User pending verification.');
        if (user.status.toLowerCase() !== 'active')
            throw new Error('Authentication failed. User pending verification.');
        const payload = {
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            id: user.id,
            role_id: user.role_id,
            role_name: user.user_role.name,
            time: new Date()
        };
        var token = jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.tokenExpireTime
        });
        delete user.password;
        delete user.salt;
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                mobile: user.mobile,
                profile: user.profile,
                birth_date: user.birth_date,
                language: user.language,
                nationality: user.nationality,
                timezone: user.timezone,
                prompt_change_password: user.prompt_change_password,
                metadata: user.metadata,
                role_id: user.role_id,
                permissions: user.permissions,
                id_number: user.id_number,
                last_login: user.last_login,
                created: user.created,
                updated: user.updated,
            }
        };
    });
}

const verify = params => {
    return Users.findOne({
        where: { id: params.id },
        raw: true,
        include: [{ model: Roles }, { model: Companies }],
   }).then(user => {
        if (!user)
            throw new Error('Authentication failed. User not found.');
        if (!bcrypt.compareSync(params.password, user.password))
            throw new Error('Authentication failed. Wrong password.');
        return { success: true };
    });
}

module.exports = {
    authenticate,
    verify,
}
