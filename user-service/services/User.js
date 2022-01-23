const sequelize = require('../config/db');
const { Activity } = require('../models/Activity');
const { Country } = require('../models/Country');
const { Group } = require('../models/Group');
const { User }  = require('../models/User');
const { UserDevice }  = require('../models/UserDevice');

User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });
User.belongsTo(Country, { foreignKey: 'nationality', targetKey: 'iso' });

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
                { model: Country }
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
            include: [
                { model: Group }, 
                { model: Country }
            ],
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
        // const sql = `
        // WITH RECURSIVE cte_query
        // AS
        //     (
        //         SELECT p.id, p.referral_id, p.email, p.first_name, p.last_name, p.nationality, p.status, p.sponsor
        //         FROM users p
        //         WHERE p.id = '${id}'
        //         UNION ALL
        //         SELECT e.id, e.referral_id, e.email, e.first_name, e.last_name, e.nationality, e.status, e.sponsor
        //         FROM users e
        //             INNER JOIN cte_query c ON c.id = e.sponsor
        //     )
        //     SELECT c.*, s.first_name AS "referral.first_name", s.last_name AS "referral.last_name", 
        //         s.nationality AS "referral.nationality", s.referral_id AS "referral.referral_id", 
        //         n.nicename AS "country.nicename", n.iso AS "country.iso"
        //     FROM cte_query c
        //     INNER JOIN users s ON c.sponsor = s.id
        //     INNER JOIN countries n ON c.nationality = n.iso
        //     WHERE c.id != '${id}'
        // `;
        const sql = `
        WITH RECURSIVE descendant AS (
            SELECT  id,
                    first_name,
                    last_name,
                    referral_id,
                    sponsor,
                    status,
                    nationality,
                    email,
                    visibility,
                    0 AS level
            FROM users
            WHERE id = '${id}'
        
            UNION ALL
        
            SELECT  ft.id,
                    ft.first_name,
                    ft.last_name,
                    ft.referral_id,
                    ft.sponsor,
                    ft.status,
                    ft.nationality,
                    ft.email,
                    ft.visibility,
                    level + 1
            FROM users ft
        JOIN descendant d
        ON ft.sponsor = d.id
        )
        
        SELECT  d.id,
                d.first_name,
                d.last_name,
                d.referral_id,
                d.status,
                d.nationality,
                d.email,
                d.visibility,
                a.id AS "referral.id",
                a.first_name AS "referral.first_name",
                a.last_name AS "referral.last_name",
                a.referral_id AS "referral.referral_id",
                d.level,
                n.nicename AS "country.nicename", n.iso AS "country.iso"
        FROM descendant d
        LEFT JOIN users a ON d.sponsor = a.id
        INNER JOIN countries n ON d.nationality = n.iso
        WHERE d.level <= (
            SELECT s.value::INT
            FROM settings s
            WHERE s.category = 'system' AND s.subcategory = 'config' AND s.key = 'max_referral_levels'
            LIMIT 1
        )
        ORDER BY level, "referral.id"`;
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

async function activities(user, query) {
    try {
        const { Op } = sequelize;
        return Activity.findAndCountAll({
            attributes: [
                'action',
                'description',
                'created',
                'section',
                'subsection',
                'id',
            ],
            where: {
                ...query,
                user_id: user.id,
                action: {
                    [Op.or]: {
                        [Op.notILike]: 'admin.%',
                        [Op.notILike]: '%.login'
                    }
                },
            },
            offset: 0,
            limit: 6,
            order: [[ 'created', 'DESC' ]]
        })
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function devices(user_id) {
    try {
        return UserDevice.findAndCountAll({
            where: { user_id },
            order: [[ 'created', 'DESC' ]]
        })
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
    activities,
    devices,
}
