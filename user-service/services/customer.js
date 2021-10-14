const { Customer } = require('../models/customer');
const { User } = require('../models/user');

Customer.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

const create = customer => Customer.create(customer);

const index = (user_id, filters) => Customer.findAndCountAll({
        where: { user_id },
        order: [['created', 'DESC'], ['name', 'ASC']],
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

const show = id => Customer.findOne({
        where: { id },
    })
    .then(res => {
        return {
            success: true,
            data: res
        };
    });

const update = (id, data) => Customer.update(data, { where: { id } });

const destroy = id => Customer.destroy({ where: { id } });

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
}