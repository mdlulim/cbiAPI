// const sequelize = require('../config/db');
const { User } = require('../models/User');
const { Group } = require('../models/Group');

User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });

async function create(data) {
    try {
        return User.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * List Users
 * 
 * Get a list of users belonging to CBI.
 * 
 * @param {object} query 
 * @returns 
 */
async function index(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};
        const groupWhere = {};

        delete where.offset;
        delete where.limit;

        if (where.group) {
            groupWhere.name = where.group;
            delete where.group;
        }
        const users = await User.findAndCountAll({
            attributes: [
                'id',
                'username',
                'last_name',
                'first_name',
                'mfa',
                'kyc',
                'last_login',
                'profile',
                'id_number',
                'email',
                'blocked',
                'login_attempts',
                'settings',
                'permissions',
                'group_id',
                'verified',
                'timezone',
                'mobile',
                'metadata',
                'nationality',
                'language',
                'birth_date',
                'currency_code',
                'status',
                'archived',
                'created',
                'updated',
                'getstarted',
            ],
            where,
            include: [{ model: Group, where: groupWhere }],
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
        });
        const { count, rows } = users;
        return {
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Retrieve User
 * 
 * Retrieve a company’s user.
 * 
 * @param {string} id 
 * @returns 
 */
async function show(id) {
    try {
        const user = await User.findOne({
            attributes: [
                'id',
                'username',
                'last_name',
                'first_name',
                'mfa',
                'kyc',
                'last_login',
                'profile',
                'id_number',
                'email',
                'blocked',
                'login_attempts',
                'settings',
                'permissions',
                'group_id',
                'verified',
                'timezone',
                'mobile',
                'metadata',
                'nationality',
                'language',
                'birth_date',
                'currency_code',
                'status',
                'archived',
                'created',
                'updated',
                'getstarted',
            ],
            where: { id },
            include: [{ model: Group }],
        });
        return {
            success: true,
            data: user,
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    index,
    show,
}
