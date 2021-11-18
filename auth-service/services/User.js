const sequelize = require('../config/db');
const { Group } = require('../models/Group');
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

async function findByEmail(email) {
    try {
        return User.findOne({
            where: {
                email,
                archived: false,
                blocked: false,
                verified: true,
            },
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

module.exports = {
    create,
    show,
    update,
    findByEmail,
    findByPropertyValue,
    findByReferralId,
}
