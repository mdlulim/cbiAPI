const sequelize = require('../config/db');
const { Transaction }  = require('../models/Transaction');
const { User }  = require('../models/User');

Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function index(user_id) {
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

module.exports = {
    index,
}
