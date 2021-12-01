const sequelize = require('../config/db');
const { KYC } = require('../models/KYC');
const { Address } = require('../models/Address');

async function capture(data) {
    try {

        const result = await sequelize.transaction(async (t) => {
            for (const level of data) {
                if(level.level==='1'){
                    await Address.insertOrUpdate(level.address, { transaction: t });
                    delete level.address;
                }
                await KYC.insertOrUpdate(level, {transaction: t} );
            };
            return;
        });

        return result;
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

async function allkyc(user_id) {
    try {
        return KYC.findAll({
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
    allkyc
}
