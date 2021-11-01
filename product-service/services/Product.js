const sequelize = require('../config/db');
const { Currency }  = require('../models/Currency');
const { Product }  = require('../models/Product');
const { UserProduct }  = require('../models/UserProduct');
const { User }  = require('../models/User');

Product.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'product_id' });
User.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'user_id' });

Product.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });

async function index(user_id) {
    try {
        const products = await Product.findAndCountAll({
            include: [{
                model: UserProduct,
                where: { user_id }
            }, { model: Currency }]
        });
        const { count, rows } = products;
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

async function overview() {
    try {
        const { Op } = sequelize;
        const products = await Product.findAndCountAll({
            include: [{ model: Currency }],
            where: {
                archived: false,
                status: {
                    [Op.iLike]: 'Published'
                }
            }
        });
        const { count, rows } = products;
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

async function show(permakey) {
    try {
        const product = Product.findOne({
            where: { permakey },
            include: [{ model: Currency }]
        });
        return {
            success: true,
            data: product,
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function subscribe(data) {
    try {
        return UserProduct.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    show,
    index,
    overview,
    subscribe,
}
