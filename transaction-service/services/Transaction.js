const sequelize = require('../config/db');
const { Buddy } = require('../models/Buddy');
const { BuddyTransaction } = require('../models/BuddyTransaction');
const { Document } = require('../models/Document');
const { Transaction }  = require('../models/Transaction');
const { User }  = require('../models/User');

Buddy.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
BuddyTransaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
Document.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        return Transaction.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(data, id) {
    try {
        return Transaction.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function index(user_id, query) {
    try {
        const options = {
            nest: true,
            replacements: {},
            type: sequelize.QueryTypes.SELECT,
        };
        const query = `
        SELECT "transaction".*, "document"."id" AS "document.id", "document"."metadata" AS "document.metadata",
            "document"."file" AS "document.file"
        FROM transactions AS "transaction"
        LEFT OUTER JOIN documents AS "document" ON ("document"."metadata"->>'txid')::TEXT = "transaction"."txid"
        WHERE "transaction"."user_id" = '${user_id}'
        ORDER BY "transaction"."created" DESC`;
        const transactions = await sequelize.query(query, options);

        // count transactions
        const countQuery = `
        SELECT COUNT(*)
        FROM transactions AS "transaction"
        LEFT OUTER JOIN documents AS "document" ON ("document"."metadata"->>'txid')::TEXT = "transaction"."txid"
        WHERE "transaction"."user_id" = '${user_id}'`;
        const count = await sequelize.query(countQuery, options);

        // response
        return {
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: transactions,
            }
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function count(user_id, txtype, subtype) {
    try {
        const { Op } = sequelize;
        const where = {
            tx_type: { [Op.iLike]: txtype },
            subtype: { [Op.iLike]: subtype },
            user_id,
        };
        let count = 0;
        if (subtype.toLowerCase() === 'buddy') {
            where.subtype = 'TRANSFER';
            count = await BuddyTransaction.count({
                where,
            });
        } else {
            count = await Transaction.count({
                where,
            });
        }
        return {
            success: true,
            data: count || 0,
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function totals(user_id, txtype, subtype) {
    try {
        const { Op } = sequelize;
        const where = {
            tx_type: { [Op.iLike]: txtype },
            subtype: { [Op.iLike]: subtype },
            user_id,
        };
        let total = 0;
        if (subtype.toLowerCase() === 'buddy') {
            total = await BuddyTransaction.sum('amount', {
                where,
            });
        } else {
            total = await Transaction.sum('total_amount', {
                where,
            });
        }
        return {
            success: true,
            data: total || 0,
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    index,
    update,
    count,
    totals,
}
