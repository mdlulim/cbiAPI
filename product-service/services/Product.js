// const sequelize = require('../config/db');
const { Product }  = require('../models/Product');
const { UserProduct }  = require('../models/UserProduct');
const { User }  = require('../models/User');

Product.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'product_id' });
User.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'user_id' });

async function index(user_id) {
    try {
        const products = await Product.findAndCountAll({
            include: [{
                model: UserProduct,
                where: { user_id }
            }]
        });
        const { count, rows } = products;
        return {
            count,
            next: null,
            previous: null,
            results: rows,
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    index,
}
