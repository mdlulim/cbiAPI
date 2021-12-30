const sequelize = require('../config/db');

async function index(user_id, product_id) {
    try {
        const options = {
            nest: true,
            replacements: {},
            type: sequelize.QueryTypes.SELECT,
        };
        const sql = `
        SELECT DISTINCT "investment"."product_id", "investment".*
        FROM investments AS "investment"
        INNER JOIN products AS "product" ON "investment"."product_id" = "product"."id"
        INNER JOIN commissions AS "commission" ON "investment"."product_id" = "commission"."referral_id"
        WHERE "investment"."user_id" = '${user_id}' AND "product"."id" = '${product_id}'
        `;
        return sequelize.query(sql, options);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    index,
}
