const sequelize = require('../config/db');
const { UserProduct }  = require('../models/UserProduct');
const { User }  = require('../models/User');
const { MemberProduct } = require('../models/MemberProduct');

UserProduct.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

MemberProduct.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
User.hasMany(MemberProduct, { foreignKey: 'user_id', targetKey: 'id' });

async function tokens(user_id) {
    try {
        const { fn, Op } = sequelize;
        const data = await MemberProduct.findOne({
            attributes: ['value'],
            where: {
                user_id,
                code: 'CBIX7',
                status: { [Op.iLike]: 'Active' },
                [Op.or]: {
                    end_date: { [Op.eq]: null },
                    [Op.and]: {
                        start_date: { [Op.lte]: fn('NOW') },
                        end_date: { [Op.gte]: fn('NOW') },
                    }
                }
            },
        });
        return data && data.value || 0;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function fraxions(user_id) {
    try {
        const tokens = await UserProduct.sum('tokens', {
            where: { user_id },
        });
        return tokens;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function fixed_plans(user_id) {
    try {
        const tokens = await UserProduct.sum('tokens', {
            where: { user_id },
        });
        return tokens;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    tokens,
    fraxions,
    fixed_plans,
}
