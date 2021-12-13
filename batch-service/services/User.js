const sequelize = require('../config/db');
const { User } = require('../models/User');
const { Transaction }  = require('../models/Transaction');
Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });


async function process(url) {
    try {
        
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
async function status(query) {
    try {
        const users = await User.findAndCountAll({
        });
        const { count, rows } = users;
        return {
            success: true,
            data: {
                count,
                results: rows,
            }
        };
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    process,
    status,
}
