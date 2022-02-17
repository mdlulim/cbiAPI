const sequelize = require('../config/db');
const { Currency }  = require('../models/Currency');
const { WealthCreator }  = require('../models/WealthCreator');
const { Product }  = require('../models/Product');
const { User }  = require('../models/User');
const { UserProduct }  = require('../models/UserProduct');

WealthCreator.belongsTo(Currency, { foreignKey: 'currency_code', targetKey: 'code' });
WealthCreator.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id' });
WealthCreator.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
WealthCreator.belongsTo(UserProduct, { foreignKey: 'user_product_id', targetKey: 'id' });

async function create(data) {
    try {
        data.start_date = sequelize.fn('NOW');
        
        // user product insert
        const userProduct = await UserProduct.create(data);
        data.user_product_id = userProduct.id;

        // investment insert
        return WealthCreator.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function index() {
    try {
        const options = {
            nest: true,
            type: sequelize.QueryTypes.SELECT
        };
        const sql = `
        SELECT DISTINCT "wealth_creator"."user_id", "user"."id", "user"."email", "user"."first_name", "user"."expiry",
            "notification"."email" AS "notification.email", "notification"."sms" AS "notification.sms",
            "wealth_creator"."id" AS "membership.id", "wealth_creator"."frequency" AS "membership.frequency",
            "wealth_creator"."created" AS "membership.created"
        FROM "users" AS "user"
        INNER JOIN "wealth_creators" AS "wealth_creator" ON "user"."id" = "wealth_creator"."user_id"
        INNER JOIN "groups" AS "group" ON "user"."group_id" = "group"."id" AND "group"."name" = 'wealth-creator' AND "group"."channel" = 'frontend'
        INNER JOIN "notifications" AS "notification" ON "user"."id" = "notification"."user_id" AND "notification"."key" = 'account-activity-updates'
        WHERE "user"."expiry" IS NOT NULL AND "user"."expiry" >= NOW() AND "user"."status" ILIKE 'ACTIVE'`;
        return sequelize.query(sql, options);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(user_id) {
    try {
        const { fn, Op } = sequelize;
        return WealthCreator.findOne({
            attributes: [
                'id',
                'frequency',
            ],
            include: [{
                model: User,
                required: true,
                attributes: [
                    'id',
                    'status',
                    'expiry',
                    'autorenew',
                ],
                where: {
                    terms_agree: true,
                    expiry: {
                        [Op.gte]: fn('NOW')
                    }
                }
            }],
            where: {
                user_id,
                status: { [Op.iLike]: 'ACTIVE' }
            }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    index,
    show,
}
