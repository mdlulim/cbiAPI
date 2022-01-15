const sequelize = require('../config/db');
const { Currency } = require('../models/Currency');
const { Product } = require('../models/Product');
const { ProductCategory } = require('../models/ProductCategory');
const { ProductSubCategory } = require('../models/ProductSubCategory');
const { UserProduct } = require('../models/UserProduct');
const { User } = require('../models/User');

Product.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });
Product.belongsTo(ProductCategory, { foreignKey: 'category_id', targetKey: 'id' });

Product.belongsTo(UserProduct, { foreignKey: 'id', targetKey: 'product_id' });
UserProduct.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
UserProduct.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id' });

async function createCategory(data) {
    try {
        return ProductCategory.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function create(data) {
    try {
        return Product.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function index(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};

        delete where.offset;
        delete where.limit;

        return Product.findAndCountAll({
            where,
            include: [{ model: Currency }, { model: ProductCategory }],
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function history(query) {
    try {

        return sequelize.query("SELECT users.first_name, users.last_name, users.referral_id, users.id, user_products.id, user_products.user_id, user_products.product_id, user_products.created, user_products.status, user_products.start_date, user_products.end_date, user_products.income," +
            "user_products.tokens, products.id, products.title, products.type, products.category_title, products.category_id, products.fees" +
            " FROM public.user_products" +
            " LEFT JOIN users" +
            " ON user_products.user_id = users.id" +
            " LEFT JOIN products" +
            " ON user_products.product_id = products.id" +
            " ORDER BY created DESC"
        );

    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
    // try {
    //     const { offset, limit } = query;
    //     const where = query || {};
    //     const userWhere = {};

    //     delete where.offset;
    //     delete where.limit;

    //     if (where.user) {
    //         userWhere.id = where.user;
    //         delete where.user;
    //     }

    //     return UserProduct.findAndCountAll({
    //         where,
    //         include: [{ model: User }],
    //         order: [['created', 'DESC']],
    //         offset: offset || 0,
    //         limit: limit || 100,
    //     });
    // } catch (error) {
    //     console.error(error.message || null);
    //     throw new Error('Could not process your request');
    // }
}

async function cancel(query) {
    try {
        const { offset, limit } = query;
        const where = { status: ['Pending Cancellation', 'Cancellation Complete', 'Cancellation Rejected']};

        delete where.offset;
        delete where.limit;

        return UserProduct.findAndCountAll({
            where,
            include: [{ model: User }, { model: Product }],
            offset: offset || 0,
            limit: limit || 100,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function cancelStatus(id, data) {
    try {
        return UserProduct.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function categories(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};

        delete where.offset;
        delete where.limit;

        return ProductCategory.findAndCountAll({
            where,
            order: [['title', 'ASC']],
            offset: offset || 0,
            limit: limit || 100,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function getSubcategories(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};

        delete where.offset;
        delete where.limit;

        return ProductSubCategory.findAndCountAll({
            where,
            order: [['title', 'ASC']],
            offset: offset || 0,
            limit: limit || 100,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function getMembersByProductId(product_id) {
    try {

        return sequelize.query("SELECT * FROM users ur JOIN user_products up ON ur.id = up.user_id  WHERE up.product_id ='" + product_id + "'"
        );

    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id) {
    try {
        return Product.findOne({
            where: { id },
            include: [{ model: ProductCategory }],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request in service');
    }
}

async function showCategory(id) {
    try {
        return ProductCategory.findOne({
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request in service');
    }
}

async function showSubcategory(id) {
    try {
        return ProductSubCategory.findOne({
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request in service');
    }
}

async function findByPermakey(permakey) {
    try {
        return Product.findOne({
            where: { permakey },
            include: [{ model: Currency }, { model: ProductCategory }],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * 
 * Update Product
 * 
 * Update company’s product details.
 * 
 * @param {string} id
 * @param {string} data
 * @returns
 */
async function update(id, data) {
    try {
        return Product.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}


/**
 * 
 * Update Product
 * 
 * Update company’s product details.
 * 
 * @param {string} id
 * @param {string} data 
 * @returns 
 */
async function updateCategory(id, data) {
    try {
        return ProductCategory.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * 
 * Update Product Subcatecory
 * 
 * Update company’s product Subcatecory.
 * 
 * @param {string} id
 * @param {string} data 
 * @returns 
 */
async function updateSubcategory(id, data) {
    try {
        return ProductSubCategory.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroy(id) {
    try {
        return Product.destroy(id);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    index,
    history,
    show,
    update,
    destroy,
    findByPermakey,
    categories,
    createCategory,
    getMembersByProductId,
    updateCategory,
    showCategory,
    getSubcategories,
    showSubcategory,
    updateSubcategory,
    cancel,
    cancelStatus,
}
