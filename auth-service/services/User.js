const sequelize = require('../config/db');
const { Group } = require('../models/Group');
const { OldSystemClient }  = require('../models/OldSystemClient');
const { User }  = require('../models/User');

User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });

async function create(data) {
    try {
        return User.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id) {
    try {
        const user = await User.findOne({
            where: { id },
            include: [{ model: Group }],
        });
        return user;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function findByEmail(email, params = null) {
    try {
        const where = params || {
            archived: false,
            blocked: false,
            verified: true,
        };
        where.email = email;
        return User.findOne({
            where,
            include: [{ model: Group }],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function findByReferralId(referral_id) {
    try {
        return User.findOne({
            where: { referral_id },
            include: [{ model: Group }],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(id, data) {
    try {
        data.updated = sequelize.fn('NOW');
        return User.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function findByPropertyValue(prop, value) {
    try {
        const { Op } = sequelize;
        var where = {};
        if (prop === 'referral_id') {
            where[prop] = value;
        } else {
            where[prop] = {
                [Op.iLike]: value
            };
        }
        return User.findOne({ where });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function showOldUser(email) {
    try {
        const { Op } = sequelize;
        return OldSystemClient.findOne({
            where: {
                blocked: false,
                migrated: false,
                allow_migration: true,
                user_id: {
                    [Op.ne]: null,
                },
                email: {
                    [Op.iLike]: email.trim(),
                }
            },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function showOldUserByToken(token, migrated = false) {
    try {
        const { Op } = sequelize;
        return OldSystemClient.findOne({
            where: {
                email_verification_token: token,
                allow_migration: true,
                blocked: false,
                migrated,
                user_id: {
                    [Op.ne]: null,
                },
            },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function updateOldUser(data, id) {
    try {
        data.updated = sequelize.fn('NOW');
        return OldSystemClient.update(data, {
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    show,
    update,
    findByEmail,
    updateOldUser,
    findByPropertyValue,
    showOldUserByToken,
    findByReferralId,
    showOldUser,
}
