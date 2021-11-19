const { UserProduct }  = require('../models/UserProduct');
const { User } = require('../models/User');
const { Product } = require('../models/Product');

User.hasMany(Product);
UserProduct.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});
UserProduct.hasOne(Product, {foreignKey: 'product_id', targetKey: 'id'})

async function index() {
    try {
        return User.findAll({
            order: [['created', 'DESC']],
            include: [{
                model: UserProduct,
                include: [Product]
            }]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    index
}