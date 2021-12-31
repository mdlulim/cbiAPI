const sequelize = require('../config/db');
const { BankAccount } = require('../models/BankAccount');
const { User } = require('../models/User');
const { OTPAuth } = require('../models/OTPAuth');
BankAccount.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function createOtp(data) {
    return OTPAuth.create(data);
}

async function deleteOtp(user_id) {
    return OTPAuth.destroy({ where: { user_id } });
}

async function create(data) {
    try {
        return BankAccount.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function index(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};

        delete where.offset;
        delete where.limit;

        return BankAccount.findAndCountAll({
            include : [{
                attributes: [
                    'first_name',
                    'email',
                    'id',
                ],
                model: User,
                where,
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
            }]
        })
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

async function getBankAccountsPending() {
    console.log("Test Bank service EndPoint===================================================")
    try {
        
        const accounts = await BankAccount.findAndCountAll({
            where: { status: 'Pending' },
            include : [{
                attributes: [
                    'first_name',
                    'email',
                    'id',
                    'mobile',
                ],
                model: User,
            }]
        });
        const { count, rows } = accounts;
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
        console.error(error || null);
        throw new Error('Could not process your request -09');
    }
}

async function show(id,) {
    try {
        return BankAccount.findOne({
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * 
 * Update BankAccount
 * 
 * Update company’s currency details.
 * 
 * @param {string} code
 * @param {string} data 
 * @returns 
 */
async function update(id, data) {
    try {
        return BankAccount.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

// async function destroy(code) {
//     try {
//         return BankAccount.destroy(code);
//     } catch (error) {
//         console.error(error.message || null);
//         throw new Error('Could not process your request');
//     }
// }

module.exports = {
    create,
    index,
    show,
    update,
    getBankAccountsPending
}
