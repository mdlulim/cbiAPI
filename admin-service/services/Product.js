const sequelize = require('../config/db');
const { Currency } = require('../models/Currency');
const { FraxionCalculation } = require('../models/FraxionCalculation');
const { Group } = require('../models/Group');
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

Product.belongsTo(ProductSubCategory, { foreignKey: 'subcategory_id', targetKey: 'id' });
ProductSubCategory.hasMany(Product, { foreignKey: 'subcategory_id', targetKey: 'id' });

ProductSubCategory.belongsTo(ProductCategory, { foreignKey: 'category_id', targetKey: 'id' });
ProductCategory.hasMany(ProductSubCategory, { foreignKey: 'category_id', targetKey: 'id' });

UserProduct.belongsTo(User, { foreignKey: 'cancellation_approved_by', targetKey: 'id', as: 'cancellation_approver' });
User.hasMany(UserProduct, { foreignKey: 'cancellation_approved_by', targetKey: 'id', as: 'cancellation_approver' });

User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });

FraxionCalculation.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });

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

async function cancellations(query) {
    try {
        const { offset, limit } = query;
        const where = {
            cancellation_status: [
                'Pending',
                'Complete',
                'Rejected',
            ]
        };

        delete where.offset;
        delete where.limit;

        return UserProduct.findAndCountAll({
            where,
            include: [{
                model: User
            }, {
                model: Product,
                include: [{
                    model: Currency,
                    model: ProductSubCategory,
                    include: [{ model: ProductCategory }],
                }]
            }, {
                attributes: [
                    'id',
                    'first_name',
                    'last_name',
                ],
                model: User,
                as: 'cancellation_approver',
                include: [{ model: Group }]
            }],
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
            include: [{ model: ProductCategory }],
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

async function showSubcategoryByCode(code) {
    try {
        return ProductSubCategory.findOne({
            where: { code },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request in service');
    }
}

async function fraxionHolders() {
    try {
        const options = {
            nest: true,
            type: sequelize.QueryTypes.SELECT
        };
        const query = `
        SELECT SUM("member_products_line"."value") AS fraxions, "user"."id", "user"."email", "user"."mobile",
            "user"."first_name", "user"."last_name", "user"."referral_id", "account"."id" AS "account.id",
            "account"."balance" AS "account.balance", "account"."available_balance" AS "account.available_balance"
        FROM member_products "member_product"
        INNER JOIN member_products_lines "member_products_line" ON "member_product"."id" = "member_products_line".member_product_id
        INNER JOIN users "user" ON "member_product"."user_id" = "user"."id"
        INNER JOIN groups "group" ON "user"."group_id" = "group"."id" AND "group"."name" = 'wealth-creator'
        INNER JOIN wealth_creators "wealth_creator" ON "user"."id" = "wealth_creator"."user_id"
        INNER JOIN accounts "account" ON "user"."id" = "account"."user_id"
        WHERE "member_product".code = 'FX' AND "member_product"."status" = 'Active'
            AND "member_product"."status" = 'Active' AND "member_products_line"."start_date" <= NOW()
            AND "member_products_line"."end_date" >= NOW() AND "user"."expiry" >= NOW()
        GROUP BY "user"."id", "account"."id", "account"."balance", "account"."available_balance"`;
        return sequelize.query(query, options);
    } catch (error) {
        console.error(error.message || '---- errror -----');
        throw new Error('Could not process your request in service');
    }
}

async function fraxionCalculations(condition) {
    try {
        return FraxionCalculation.findAndCountAll({
            where: condition,
            include: [{ model: Currency }],
            order: [['date', 'ASC']]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request in service');
    }
}

async function captureFraxionCalculations(data) {
    try {
        return FraxionCalculation.create(data);
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
        data.updated = sequelize.fn('NOW');
        return ProductSubCategory.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function getProductProfits(query) {
    try {
        return sequelize.query("SELECT p.id, p.title AS product_title, p.category_title ,COUNT(mpl.product_id) AS cnt ,SUM(up.income) income ,SUM(up.invested_amount) invested_amount"
        +" FROM products p"
        +" LEFT JOIN member_products_lines mpl ON (mpl.product_id = p.id)"
        +" LEFT JOIN user_products up ON (up.product_id = mpl.product_id)"
        +" GROUP BY p.id, up.product_id, p.title"
        +" HAVING COUNT(mpl.product_id) > 0"
        +" ORDER BY p.title");
      
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function getProfitsPerProduct(product_id) {
    try {
        return sequelize.query("SELECT mpl.id, mpl.member_product_id, mpl.start_date, mpl.end_date, mpl.transaction_id, mpl.created, t.user_id, u.first_name, u.last_name, u.referral_id, p.title AS product_title, p.category_title, t.metadata"
        +" FROM member_products_lines mpl"
        +" LEFT JOIN transactions t ON (t.id = mpl.transaction_id)"
        +" LEFT JOIN users u ON (u.id = t.user_id)"
        +" LEFT JOIN products p ON (p.id = mpl.product_id)"
        +" WHERE product_id = '"+product_id+"'"
        +" ORDER BY mpl.created DESC");
      
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}
//GROUP BY u.id, user_product_id, up.product_id, up.income, up.invested_amount, up.created



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
    fraxionHolders,
    findByPermakey,
    categories,
    createCategory,
    getMembersByProductId,
    updateCategory,
    showCategory,
    showSubcategoryByCode,
    fraxionCalculations,
    captureFraxionCalculations,
    getSubcategories,
    showSubcategory,
    updateSubcategory,
    cancellations,
    cancelStatus,
    getProductProfits,
    getProfitsPerProduct,
}
