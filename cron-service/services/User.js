const sequelize = require('../config/db');
const moment = require('moment');
const { Group } = require('../models/Group');
const { MemberProduct } = require('../models/MemberProduct');
const { Notification } = require('../models/Notification');
const { User }  = require('../models/User');

User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });
Notification.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
User.hasMany(User, { foreignKey: 'user_id', targetKey: 'id' });

MemberProduct.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
User.hasMany(MemberProduct, { foreignKey: 'user_id', targetKey: 'id' });

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
        delete where.offset;
        delete where.limit;
        const users = await User.findAndCountAll({
            where,
            include: [{ model: Group }],
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

async function show(id) {
    try {
        return User.findOne({
            where: { id },
            include: [{ model: Group }],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(data, id) {
    try {
        data.updated = sequelize.fn('NOW');
        return User.update(data, {
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function bulkUpdate(data, where) {
    try {
        data.updated = sequelize.fn('NOW');
        return User.update(data, { where });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function wcEligibleForAutoRenewNotify(query) {
    try {
        const today   = moment().format('YYYY-MM-DD');
        const expiry  = moment().add(5, 'days').format('YYYY-MM-DD');
        const options = {
            nest: true,
            type: sequelize.QueryTypes.SELECT
        };
        const sql = `
        SELECT "user"."id", "user"."email", "user"."first_name", "user"."expiry", "notification"."email" AS "notification.email", "notification"."sms" AS "notification.sms"
        FROM "users" AS "user"
        INNER JOIN "groups" AS "group" ON "user"."group_id" = "group"."id" AND "group"."name" = 'wealth-creator' AND "group"."channel" = 'frontend'
        INNER JOIN "notifications" AS "notification" ON "user"."id" = "notification"."user_id" AND "notification"."key" = 'account-activity-updates'
        WHERE (
                "user"."expiry" IS NOT NULL AND
                "user"."expiry" >= to_date('${today}', 'YYYY-MM-DD') AND
                "user"."expiry" <= to_date('${expiry}', 'YYYY-MM-DD')
            ) AND
            "user"."status" ILIKE 'Active' AND
            "user"."autorenew" = false AND
            "user"."archived" = false`;
        return sequelize.query(sql, options);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function wcDueForAutoRenew(query) {
    try {
        const today   = moment().format('YYYY-MM-DD');
        const options = {
            nest: true,
            type: sequelize.QueryTypes.SELECT
        };
        const sql = `
        SELECT "user"."id", "user"."email", "user"."first_name", "user"."expiry",
            "notification"."email" AS "notification.email", "notification"."sms" AS "notification.sms",
            "account"."id" AS "account.id", "account"."reference" AS "account.reference", 
            "account"."available_balance" AS "account.available_balance", "account"."balance" AS "account.balance"
        FROM "users" AS "user"
        INNER JOIN "groups" AS "group" ON "user"."group_id" = "group"."id" AND "group"."name" = 'wealth-creator' AND "group"."channel" = 'frontend'
        INNER JOIN "notifications" AS "notification" ON "user"."id" = "notification"."user_id" AND "notification"."key" = 'account-activity-updates'
        INNER JOIN "accounts" AS "account" ON "user"."id" = "account"."user_id" AND "account"."is_primary" = true
        WHERE (
                "user"."expiry" IS NOT NULL AND
                "user"."expiry" = to_date('${today}', 'YYYY-MM-DD')
            ) AND
            "user"."status" ILIKE 'Active' AND
            "user"."autorenew" = true AND
            "user"."archived" = false`;
        return sequelize.query(sql, options);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function upline(user_id) {
    try {
        const options = {
            nest: true,
            replacements: {},
            type: sequelize.QueryTypes.SELECT,
        };
        const data = [];
        let found = false;
        let id = user_id;
        let level = 1; // payout MLM structure - 10 levels up
        
        do {
            // retrieve uplines who are WC
            const query = `
            SELECT "upline"."id", "upline"."first_name", "upline"."last_name", "upline"."expiry",
                "upline"."email", "upline"."mobile", "group"."name", "account"."id" AS "account.id",
                "account"."balance" AS "account.balance", "account"."available_balance" AS "account.available_balance"
            FROM users AS "user"
            INNER JOIN users AS "upline" ON "user"."sponsor" = "upline"."id"
            INNER JOIN groups AS "group" ON "upline"."group_id" = "group"."id" AND "group"."name" = 'wealth-creator'
            INNER JOIN accounts AS "account" ON "upline"."id" = "account"."user_id"
            WHERE "user"."id" = '${id}' AND "upline"."id" != "user"."id" AND "upline"."expiry" >= NOW()
            LIMIT 1`;
            const records = await sequelize.query(query, options);
            if (level <= 10 && records && records.length > 0) {
                const [record] = records;
                if (record && record.id) {
                    data.push(record);
                    id = record.id;
                    found = true;
                    level++;
                } else found = false;
            } else found = false;
        } while (found);
        return data;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function referrals(id) {
    try {
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
                    mobile,
                    visibility,
                    group_id,
                    expiry,
                    stars,
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
                    ft.mobile,
                    ft.visibility,
                    ft.group_id,
                    ft.expiry,
                    ft.stars,
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
                d.mobile,
                d.visibility,
                a.id AS "referral.id",
                a.first_name AS "referral.first_name",
                a.last_name AS "referral.last_name",
                a.referral_id AS "referral.referral_id",
                d.level,
                d.stars,
                n.nicename AS "country.nicename",
                n.iso AS "country.iso"
        FROM descendant d
        LEFT JOIN users a ON d.sponsor = a.id
        INNER JOIN countries n ON d.nationality = n.iso
        INNER JOIN wealth_creators wc ON d.id = wc.user_id
        INNER JOIN groups g ON d.group_id = g.id
        WHERE d.level <= (
            SELECT s.value::INT
            FROM settings s
            WHERE s.category = 'system' AND s.subcategory = 'config' AND s.key = 'max_referral_levels'
            LIMIT 1
        ) AND d.expiry >= NOW()
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

async function fraxions(id) {
    try {
        const { fn, Op } = sequelize;
        const response = await MemberProduct.findOne({
            attributes: ['value'],
            where: {
                user_id: id,
                code: { [Op.iLike]: 'FX' },
                status: { [Op.iLike]: 'ACTIVE' },
                [Op.and]: [
                    { start_date: { [Op.ne]: null } },
                    { start_date: { [Op.lte]: fn('NOW') } },
                    { end_date: { [Op.ne]: null } },
                    { end_date: { [Op.gte]: fn('NOW') } }
                ],
            },
        });
        return (response && response.value) ? parseInt(response.value) : 0;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    index,
    show,
    update,
    bulkUpdate,
    wcEligibleForAutoRenewNotify,
    wcDueForAutoRenew,
    upline,
    referrals,
    fraxions,
}
