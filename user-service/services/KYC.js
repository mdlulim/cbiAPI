const sequelize = require('../config/db');
const { KYC } = require('../models/KYC');

async function capture(data) {
    try {

        const result = await sequelize.transaction(async (t) => {

            data.forEach(async(level) => {
                await KYC.insertOrUpdate(level, {transaction: t} )
            });
            return
        });

        return result

    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function index(user_id) {
    try {
        return KYC.findAndCountAll({
            where: { user_id },
            order: [['created', 'DESC']],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    capture,
    index,
}
