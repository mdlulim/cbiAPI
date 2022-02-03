const sequelize = require('../config/db');
const { Account }  = require('../models/Account');
const { Currency }  = require('../models/Currency');
const { Product }  = require('../models/Product');
const { MemberProduct }  = require('../models/MemberProduct');
const { MemberProductLine }  = require('../models/MemberProductLine');
const { ProductCategory }  = require('../models/ProductCategory');
const { ProductSubCategory }  = require('../models/ProductSubCategory');
const { Transaction }  = require('../models/Transaction');
const { UserProduct }  = require('../models/UserProduct');
const { User }  = require('../models/User');

Account.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

Product.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'product_id' });
UserProduct.hasMany(Product, { foreignKey: 'id', targetKey: 'product_id' });
User.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'user_id' });

MemberProduct.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
User.hasMany(MemberProduct, { foreignKey: 'user_id', targetKey: 'id' });

MemberProductLine.belongsTo(MemberProduct, { foreignKey: 'member_product_id', targetKey: 'id', as: 'product_lines' });
MemberProduct.hasMany(MemberProductLine, { foreignKey: 'member_product_id', targetKey: 'id', as: 'product_lines' });

MemberProductLine.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id' });

MemberProduct.belongsTo(ProductSubCategory, { foreignKey: 'code', targetKey: 'code' });

Product.belongsTo(ProductSubCategory, { foreignKey: 'subcategory_id', targetKey: 'id' });
ProductSubCategory.hasMany(Product, { foreignKey: 'subcategory_id', targetKey: 'id' });

ProductSubCategory.belongsTo(ProductCategory, { foreignKey: 'category_id', targetKey: 'id' });
ProductCategory.hasMany(ProductSubCategory, { foreignKey: 'category_id', targetKey: 'id' });

Product.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });

Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
User.hasMany(Transaction, { foreignKey: 'user_id', targetKey: 'id' });

async function index(user_id) {
    try {
        const { fn, Op } = sequelize;
        const products = await Product.findAndCountAll({
            include: [{
                model: UserProduct,
                where: {
                    user_id,
                    status: 'Active',
                    [Op.or]: {
                        end_date: { [Op.eq]: null },
                        [Op.and]: {
                            start_date: { [Op.lte]: fn('NOW') },
                            end_date: { [Op.gte]: fn('NOW') },
                        }
                    }
                }
            },{
                model: Currency
            }, {
                model: ProductSubCategory,
                include: [{ model: ProductCategory }],
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

async function memberProducts(user_id) {
    try {
        const { fn, Op } = sequelize;
        return MemberProduct.findAndCountAll({
            where: {
                user_id,
                status: { [Op.iLike]: 'Active' },
                [Op.or]: {
                    end_date: { [Op.eq]: null },
                    [Op.and]: {
                        start_date: { [Op.lte]: fn('NOW') },
                        end_date: { [Op.gte]: fn('NOW') },
                    }
                }
            },
            include: [{
                model: ProductSubCategory,
                include: [{ model: ProductCategory }],
            }, {
                as: 'product_lines',
                model: MemberProductLine,
                include: [{ model: Product }]
            }]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(data, id) {
    try {
        data.updated = sequelize.fn('NOW');
        return MemberProduct.update(data, {
            where: { id }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function overview(query) {
    try {
        const { Op } = sequelize;
        const products = await Product.findAndCountAll({
            include: [{ model: Currency }, { model: ProductSubCategory }],
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

async function find(id, return_object = true) {
    try {
        const product = await Product.findOne({
            where: { id },
            include: [{ model: Currency }, { model: ProductSubCategory }]
        });
        if (return_object) {
            return {
                success: true,
                data: product,
            };
        }
        return product;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(permakey) {
    try {
        const product = await Product.findOne({
            where: { permakey },
            include: [{
                model: Currency
            },
            {
                model: ProductSubCategory,
                include: [{ model: ProductCategory }],
            }]
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

async function userProduct(user_id, code) {
    try {
        const { fn, Op } = sequelize;
        return MemberProduct.findOne({
            where: {
                code,
                user_id,
                status: { [Op.iLike]: 'Active' },
                [Op.or]: {
                    end_date: { [Op.eq]: null },
                    [Op.and]: {
                        start_date: { [Op.lte]: fn('NOW') },
                        end_date: { [Op.gte]: fn('NOW') },
                    }
                }
            }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function findByCode(product_code) {
    try {
        return Product.findOne({
            where: { product_code },
            include: [{ model: Currency }, { model: ProductSubCategory }]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function subscribe(data) {
    try {
        const { entity, user_id, code, value, product_id, transaction_id, end_date } = data;
        const where = { code, entity, user_id };
        let memberProduct = await MemberProduct.findOne({ where });
        if (memberProduct && memberProduct.id) {
            await MemberProduct.update({
                status: 'Active',
                updated: sequelize.fn('NOW'),
                value: parseFloat(memberProduct.value) + value
            }, { where });
        } else {
            memberProduct = await MemberProduct.create({
                code,
                value,
                entity,
                user_id,
                start_date: sequelize.fn('NOW'),
            });
        }
        return MemberProductLine.create({
            value,
            product_id,
            unit: code,
            transaction_id,
            end_date: end_date || null,
            member_product_id: memberProduct.id,
        });
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
                model: ProductSubCategory
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
            where: { archived: false },
            order: [[ 'sort_order', 'ASC' ], [ 'title', 'ASC' ]]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function subcategories() {
    try {
        return ProductSubCategory.findAndCountAll({
            where: { archived: false },
            include: [{
                model: ProductCategory,
            }, {
                model: Product,
                order: [[ 'sort_order', 'ASC' ]],
                include: [{ model: Currency }],
            }],
            order: [[ 'sort_order', 'ASC' ], [ 'title', 'ASC' ]]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function subcategory(permakey) {
    try {
        return ProductSubCategory.findOne({
            where: { permakey, archived: false },
            include: [{
                model: ProductCategory,
            }, {
                model: Product,
                order: [[ 'sort_order', 'ASC' ]],
                include: [{ model: Currency }]
            }],
            order: [[ 'sort_order', 'ASC' ], [ 'title', 'ASC' ]]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function category(permakey) {
    try {
        return ProductCategory.findOne({
            where: { permakey, archived: false },
            include: [{
                model: ProductSubCategory,
            }]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function transactions(code, user_id) {
    try {
        const { Op } = sequelize;
        return Transaction.findAndCountAll({
            order: [['created', 'DESC']],
            attributes: [
                'fee',
                'txid',
                'created',
                'tx_type',
                'currency',
                'total_amount',
                [sequelize.json('metadata.tokens'), 'tokens']
            ],
            where: {
                user_id,
                subtype: 'product',
                txid: { [Op.iLike]: `${code}%` },
                status: { [Op.iLike]: 'Completed' },
            }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    find,
    show,
    index,
    memberProducts,
    update,
    overview,
    subscribe,
    products,
    categories,
    subcategories,
    subcategory,
    category,
    findByCode,
    userProduct,
    transactions,
}
