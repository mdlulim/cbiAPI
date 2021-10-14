const { Product } = require('../models/product');
const { User } = require('../models/user');

Product.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

const create = product => Product.create(product);

const index = (user_id, filters) => Product.findAndCountAll({
        where: { user_id },
        order: [['created', 'DESC'], ['title', 'ASC']],
        offset: filters.offset || 0,
        limit: filters.limit || 50,
    })
    .then(res => {
        return {
            success: true,
            data: {
                count: res.count,
                next: null,
                previous: null,
                results: res.rows
            }
        };
    });

const show = id => Product.findOne({
        where: { id },
    })
    .then(res => {
        return {
            success: true,
            data: res
        };
    });

const update = (id, data) => Product.update(data, { where: { id } });

const destroy = id => Product.destroy({ where: { id } });

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
}