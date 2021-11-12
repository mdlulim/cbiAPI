const sequelize = require('../config/db');
// const { BuddyAccount } = require('../models/BuddyAccount');
const { Group } = require('../models/Group');
const { User }  = require('../models/User');

User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });
// BuddyAccount.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

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
        // const buddy = await BuddyAccount.findOne({ where: { user_id, id } })
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
                'sponsor',
                'autorenew',
                'expiry',
            ],
            where: { id },
            include: [
                { model: Group }, 
                // { model: BuddyAccount }
            ],
        });
        return user;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function findByEmail(email) {
    try {
        const { Op } = sequelize;
        return User.findOne({
            where: {
                email,
                archived: false,
                status: { [Op.iLike]: 'Active' }
            },
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

async function referrals(id) {
    try {
        const sql = `
        WITH RECURSIVE cte_query
        AS
            (
                SELECT p.id, p.referral_id, p.email, p.first_name, p.last_name, p.nationality, p.status, p.sponsor
                FROM users p
                WHERE p.id = '${id}'
                UNION ALL
                SELECT e.id, e.referral_id, e.email, e.first_name, e.last_name, e.nationality, e.status, e.sponsor
                FROM users e
                    INNER JOIN cte_query c ON c.id = e.sponsor
            )
            SELECT *
            FROM cte_query
            WHERE id != '${id}'
        `;
        const options = {
            nest: true,
            type: sequelize.QueryTypes.SELECT
        };
        return sequelize.query(sql, options);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function referralsByUUID(id) {
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

async function countReferrals(id) {
    try {
        const count = await User.count({
            where: { sponsor: id },
            include: [{ model: Group }],
        });
        return count;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function search(prop, value) {
    try {
        const { Op, fn, col, where } = sequelize;
        const whereQry = {
            status: 'Active',
            blocked: false,
            verified: true,
        };

        if (prop === 'referral_id') {
            whereQry.referral_id = value;
        } else if (prop === 'find') {
            whereQry.userQuery = where(
                fn(
                    'CONCAT',
                    col('first_name'),
                    ' ',
                    col('last_name'),
                    ' ',
                    col('referral_id')
                ),
                {
                    [Op.iLike]: `%${value}%`
                }
            );
        }
        const users = await User.findAndCountAll({
            attributes: [
                'last_name',
                'first_name',
                'referral_id',
            ],
            where: whereQry,
            include: [{
                model: Group,
                channel: 'frontend',
                is_public: true,
            }],
        });
        return users;
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
    referrals,
    countReferrals,
    referralsByUUID,
    search,
}
