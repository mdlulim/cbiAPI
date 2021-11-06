// const sequelize = require('../config/db');
const { User } = require('../models/User');
const { KYC } = require('../models/KYC');

KYC.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        return KYC.create(data);
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

        delete where.offset;
        delete where.limit;

        const users = await User.findAndCountAll({
            attributes: [
                'id',,
                'user_id',
                'level',
                'data',
                'documents',
                'status',
                'created',
                'updated',
                'verified',
                'verification_date',
                'verified_by',
                'withdrawal_limit',
                'deposit_limit'
            ],
            where,
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
        return KYC.findOne({
            where: { user_id: id }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * List User Products
 * 
 * Get a list of products belonging to CBI's user.
 * 
 * @param {string} id 
 * @returns 
 */
async function kycApplications(id) {
    try {
        const applications = await KYC.findAll({
        });
        return {
            success: true,
            data: applications,
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
    kycApplications,
}
