const sequelize = require('../config/db');
const { Transaction }  = require('../models/Transaction');
const { User }  = require('../models/User');

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
        const where = {
            ...query,
            user_id,
        };
        const transactions = await Transaction.findAndCountAll({
            where,
            order: [[ 'created', 'DESC' ]],
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
