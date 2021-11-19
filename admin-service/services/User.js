const sequelize = require('../config/db');
const { Address } = require('../models/Address');
const { EmailAddress } = require('../models/EmailAddress');
const { MobileNumber } = require('../models/MobileNumber');
const { BankAccount } = require('../models/BankAccount');
const { CryptoAccount } = require('../models/CryptoAccount');
const { Group } = require('../models/Group');
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const { UserProduct }  = require('../models/UserProduct');
const { Transaction }  = require('../models/Transaction');
const { Account }  = require('../models/Account');

const { KYC } = require('../models/KYC');
 
Address.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
EmailAddress.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
MobileNumber.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
BankAccount.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
CryptoAccount.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });
Product.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'product_id' });
User.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'user_id' });
User.hasMany(KYC, {foreignKey: 'user_id', targetKey: 'id'});


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
                'terms_agree',
                'stars',
                'referral_id',
                'sponsor',
                'autorenew',
                'expiry',
                'deactivation_date',
                'permission_level',
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
                'terms_agree',
                'stars',
                'referral_id',
                'autorenew',
                'expiry',
                'deactivation_date',
                'permission_level',
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

/**
 * 
 * Update User
 * 
 * Update company’s user details.
 * 
 * @param {string} id
 * @param {string} data 
 * @returns 
 */
async function update(id, data) {
    try {
        return User.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * 
 * Archived User
 * 
 * Archived company’s user.
 * 
 * @param {string} id
 * @returns 
 */
async function archive(id) {
    try {
        return User.update({
            status: 'Archived',
            archived: true,
            deactivation_date:sequelize.fn('NOW'),
            updated: sequelize.fn('NOW'),
        }, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * 
 * Block User
 * 
 * Block company’s user.
 * 
 * @param {string} id
 * @returns 
 */
async function block(id) {
    try {
        return User.update({
            status: 'Blocked',
            blocked: true,
            updated: sequelize.fn('NOW'),
        }, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * 
 * Archived User
 * 
 * Archived company’s user.
 * 
 * @param {string} id
 * @returns 
 */
async function unarchive(id) {
    try {
        return User.update({
            status: 'Active',
            archived: false,
            updated: sequelize.fn('NOW'),
        }, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * 
 * Block User
 * 
 * Block company’s user.
 * 
 * @param {string} id
 * @returns 
 */
async function unblock(id) {
    try {
        return User.update({
            status: 'Active',
            blocked: false,
            archived: false,
            updated: sequelize.fn('NOW'),
        }, { where: { id } });
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
 * @param {string} user_id 
 * @returns 
 */
async function products(user_id) {
    try {
        const products = await Product.findAndCountAll({
            include: [{
                model: UserProduct,
                where: { user_id }
            }]
        });
        const { count, rows } = products;
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

async function referrals(id) {
    try {
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
                'terms_agree',
                'stars',
                'referral_id',
                'sponsor',
                'autorenew',
                'expiry',
                'deactivation_date',
                'permission_level',
            ],
            where: { sponsor: id },
            include: [{ model: Group }],
        });
        return users;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function transactions(user_id) {
    try {
        const transactions = await Transaction.findAndCountAll({
            where: { user_id }
        });
        const { count, rows } = transactions;
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

async function updateTransaction(id, data) {
    try {
        await Transaction.update(data, {
            where: { id }
        });
        return { success: true };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function approveDeposit(id, data) {
    let companyCondition    = {id: data.main.id};
    let companyData         = {available_balance: data.main.available_balance};

    let sponsorCondition    = {id: data.sponsor.id};
    let sponsorData         = {available_balance: data.sponsor.available_balance};

    let userCondition       = {id: data.user.id};
    let userData         = {available_balance: data.user.available_balance};

    let status = {status: data.status}
    console.log(sponsorCondition)
    try {
        await Transaction.update(status, {
            where: { id }
        });

        await Account.update(companyData,{
            where : companyCondition
        });

        await Account.update(sponsorData,{
            where : sponsorCondition
        });

        await Account.update(userData,{
            where : userCondition
        });

        return { success: true, message: "Account was successfully updated" };
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

async function addresses(user_id) {
    try {
        const addresses = await Address.findAndCountAll({
            where: { user_id }
        });
        const { count, rows } = addresses;
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

async function emails(user_id) {
    try {
        const emails = await EmailAddress.findAndCountAll({
            where: { user_id }
        });
        const { count, rows } = emails;
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

async function mobiles(user_id) {
    try {
        const mobiles = await MobileNumber.findAndCountAll({
            where: { user_id }
        });
        const { count, rows } = mobiles;
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

async function bankAccounts(user_id) {
    try {
        const accounts = await BankAccount.findAndCountAll({
            where: { user_id }
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
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function updateBankAccounts(user_id, data) {
    try {
        await BankAccount.update(data, {
            where: { user_id }
        });
        return { success: true };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request'); 
    }
}



async function cryptoAccounts(user_id) {
    try {
        const accounts = await CryptoAccount.findAndCountAll({
            where: { user_id }
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
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function findByPropertyValue(prop, value) {
    try {
        const { Op } = sequelize;
        var where = {};
        where[prop] = {
            [Op.iLike]: value
        };
        return User.findOne({ where });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}


/**
 * Get a single of group that has been created.
 * @param {string} email 
 * @returns 
 */
 async function email(email) {
    try {
        return User.findOne({
            where: { email },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
};

module.exports = {
    create,
    index,
    show,
    update,
    archive,
    block,
    unarchive,
    unblock,
    products,
    referrals,
    transactions,
    addresses,
    emails,
    mobiles,
    bankAccounts,
    cryptoAccounts,
    updateTransaction,
    approveDeposit,
    findByPropertyValue,
    updateBankAccounts,
    email
}
