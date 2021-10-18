const sequelize = require('../config/db');
const { Group } = require('../models/Group');

async function findByPropertyValue(prop,value) {
    try {
        const { Op } = sequelize;
        return Group.findOne({
            where: {
                [prop]: {
                    [Op.iLike]: value
                }
            },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    findByPropertyValue,
}