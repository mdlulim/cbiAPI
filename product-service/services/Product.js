const sequelize = require('../config/db');
const { Account }  = require('../models/Account');
const { Currency }  = require('../models/Currency');
const { Product }  = require('../models/Product');
const { ProductCategory }  = require('../models/ProductCategory');
const { UserProduct }  = require('../models/UserProduct');
const { User }  = require('../models/User');

Account.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

Product.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'product_id' });
User.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'user_id' });
Product.belongsTo(ProductCategory, { foreignKey: 'category_id', targetKey: 'id' });

Product.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });

async function index(user_id) {
    try {
        const products = await Product.findAndCountAll({
            include: [{
                model: UserProduct,
                where: { user_id }
            },{
                model: Currency
            }, {
                model: ProductCategory
            }]
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

async function overview(query) {
    try {
        const { Op } = sequelize;
        const products = await Product.findAndCountAll({
            include: [{ model: Currency }, { model: ProductCategory }],
            order: [['sort_order', 'ASC']],
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

async function find(id) {
    try {
        const product = await Product.findOne({
            where: { id },
            include: [{ model: Currency }, { model: ProductCategory }]
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

async function show(permakey) {
    try {
        const product = await Product.findOne({
            where: { permakey },
            include: [{ model: Currency }, { model: ProductCategory }]
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

async function findByCode(product_code) {
    try {
        return Product.findOne({
            where: { product_code },
            include: [{ model: Currency }, { model: ProductCategory }]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function subscribe(data) {
    try {
        data.start_date = sequelize.fn('NOW');
        return UserProduct.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function products(category_id) {
    try {
        return Product.findAndCountAll({
            where: { category_id },
            order: [['sort_order', 'ASC']],
            include: [{
                model: Currency
            }, {
                model: ProductCategory
            }]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function categories() {
    try {
        return ProductCategory.findAndCountAll({
            order: [[ "title", "ASC" ]]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function transactions(permakey, user_id) {
    try {
        const options = {
            nest: true,
            replacements: {},
            type: sequelize.QueryTypes.SELECT,
        };
        const sql = `
        SELECT "transaction"."txid", "transaction"."created", "transaction"."total_amount", "transaction"."fee", "transaction"."tx_type",
            "transaction"."currency", "transaction"."metadata"->>'tokens'::text AS "tokens"
        FROM user_products AS "user_product"
        INNER JOIN products AS "product" ON "user_product"."product_id" = "product"."id"
        INNER JOIN transactions AS "transaction" ON "user_product"."id"::text = "transaction"."metadata"->>'refid'::text
        WHERE "product"."permakey" = '${permakey}' AND "transaction"."status" iLike 'Completed'
            AND "user_product"."user_id" = '${user_id}'
        ORDER BY "transaction"."created" DESC`;
        return sequelize.query(sql, options);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    find,
    show,
    index,
    overview,
    subscribe,
    products,
    categories,
    findByCode,
    transactions,
}
