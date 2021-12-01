const sequelize = require('../config/db');
const { Commission } = require('../models/Commission');

async function total(user_id, type) {
    try {
        const { Op } = sequelize;
        return Commission.findOne({
            attributes: [
                'currency_code',
                [sequelize.fn('sum', sequelize.col('amount')), 'total_amount'],
            ],
            where: {
                type: { [Op.iLike]: type },
                status: { [Op.iLike]: 'Paid' },
                user_id
            },
            group: ['currency_code']
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    total,
}
