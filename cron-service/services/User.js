const sequelize = require('../config/db');
const moment = require('moment');
const { Group } = require('../models/Group');
const { Notification } = require('../models/Notification');
const { User }  = require('../models/User');

User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });
Notification.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
User.hasMany(User, { foreignKey: 'user_id', targetKey: 'id' });

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

module.exports = {
    create,
    index,
    show,
    update,
    wcEligibleForAutoRenewNotify,
    wcDueForAutoRenew,
    upline,
}
