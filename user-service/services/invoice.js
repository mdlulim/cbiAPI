const { Customer } = require('../models/customer');
const { Invoice } = require('../models/invoice');
const { User } = require('../models/user');

Invoice.belongsTo(Customer, { foreignKey: 'customer_id', targetKey: 'id' });
Invoice.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

const create = invoice => Invoice.create(invoice)
.then(record => {
    if (record && record.id) {

    }
    return {
        success: true,
        data: record
    };
});

const index = (user_id, filters) => Invoice.findAndCountAll({
        where: { user_id, is_quote: false },
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

const show = uuid => Invoice.findOne({
        where: { uuid },
        include: [{ model: Customer }],
    })
    .then(invoice => {
        return {
            success: true,
            data: invoice
        };
    });

const update = (uuid, data) => Invoice.update(data, { where: { uuid } });

const destroy = uuid => Invoice.destroy({ where: { uuid } });

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
}