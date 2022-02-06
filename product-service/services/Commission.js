const sequelize = require('../config/db');

async function fixedPlans(user_id, product_id) {
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
        ORDER BY "investment"."created" DESC`;
        return sequelize.query(sql, options);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function fraxions(user_id, code) {
    try {
        const options = {
            nest: true,
            replacements: {},
            type: sequelize.QueryTypes.SELECT,
        };
        const sql = `
        SELECT "commission"."id", "commission"."amount", "transaction"."txid", "commission"."commission_date",
            "commission"."status", "transaction"."created", "transaction"."currency"
        FROM commissions AS "commission"
        INNER JOIN transactions AS "transaction" ON "commission"."id"::text = "transaction"."metadata"->>'refid'::text
            AND "transaction"."metadata"->>'entity' = 'commissions'
            AND "transaction".subtype = '${code.toLowerCase()}-payouts'
        -- INNER JOIN currencies AS "currency" ON "transaction"."currency" = "currency"."code"
        WHERE "commission"."type" = '${code.toUpperCase()}-PROFIT-PAYOUT' AND "commission"."user_id" = '${user_id}'
            AND "transaction"."user_id" = '${user_id}'
        ORDER BY "transaction"."created" DESC;
        `;
        return sequelize.query(sql, options);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    fixedPlans,
    fraxions,
}
