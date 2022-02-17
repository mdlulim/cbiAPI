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
    show,
}
