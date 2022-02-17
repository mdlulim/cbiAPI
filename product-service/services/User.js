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

async function update(id, data) {
    try {
        data.updated = sequelize.fn('NOW');
        return User.update(data, { where: { id } });
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

async function directReferrals(id, status = null) {
    try {
        const { Op } = sequelize;
        const where = { sponsor: id };
        if (status) {
            where.status = {
                [Op.iLike]: status,
            };
        }
        return User.findAndCountAll({
            where,
        });
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
    upline,
    directReferrals,
}
