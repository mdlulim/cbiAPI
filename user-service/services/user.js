// const sequelize = require('../config/db');
const { User } = require('../models/user');

/**
 * Get all users
 * @param {*} query 
 * @returns 
 */
async function index(query) {
    try {
        const where = query || {};
        const users = await User.findAndCountAll({
            where,
            order: [['created', 'DESC']],
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
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

module.exports = {
    index
}
