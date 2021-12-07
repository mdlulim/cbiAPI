const sequelize = require('../config/db');
const { Account }  = require('../models/Account');
const { Currency }  = require('../models/Currency');
const { Investment }  = require('../models/Investment');
const { Product }  = require('../models/Product');
const { User }  = require('../models/User');

Account.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

Investment.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });
Investment.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id' });
Investment.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function findActive() {
    try {
        const options = {
            nest: true,
            type: sequelize.QueryTypes.SELECT
        };
        const sql = `
        SELECT "investment"."id", "investment"."user_id", "investment"."product_id", "investment"."invested_amount", "investment"."accumulated_amount",
            "investment"."daily_interest", "investment"."currency_code", "investment"."fees", "investment"."metadata", "investment"."status",
            "investment"."start_date", "investment"."end_date", "investment"."created", "investment"."last_updated",
            "user"."id" AS "user.id", "user"."first_name" AS "user.first_name", "user"."last_name" AS "user.last_name", "user"."email" AS "user.email"
        FROM "investments" AS "investment"
        INNER JOIN "users" AS "user" ON "investment"."user_id" = "user"."id"
        WHERE "investment"."start_date" <= NOW() AND "investment"."end_date" >= NOW() AND "investment"."status" ILIKE 'Active'`;
        return sequelize.query(sql, options);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(id, data) {
    try {
        const { fn } = sequelize;
        data.last_updated = fn('NOW');
        return Investment.update(data, {
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    findActive,
    update,
}
