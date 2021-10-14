const { Customer } = require('../models/customer');
const { User } = require('../models/user');
const Quote = require('../models/invoice').Invoice;

Quote.belongsTo(Customer, { foreignKey: 'customer_id', targetKey: 'id' });
Quote.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

const create = quote => Quote.create(quote)
.then(record => {
    return {
        success: true,
        data: record
    };
});

const index = (user_id, filters) => Quote.findAndCountAll({
        where: { user_id, is_quote: true },
        include: [{ model: Customer }],
        order: [['created', 'DESC']],
        offset: (filters && filters.offset) || 0,
        limit: (filters && filters.limit) || 50,
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

const show = uuid => Quote.findOne({
        where: { uuid },
        include: [{ model: Customer }],
    })
    .then(quote => {
        return {
            success: true,
            data: quote
        };
    });

const update = (uuid, data) => Quote.update(data, { where: { uuid } });

const destroy = uuid => Quote.destroy({ where: { uuid } });

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
}