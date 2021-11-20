const sequelize = require('../config/db');
const { Account }  = require('../models/Account');
const { Transaction }  = require('../models/Transaction');
const { User }  = require('../models/User');

Account.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

User.hasMany(Transaction, {foreignKey: 'user_id', targetKey: 'id'});
Transaction.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});

async function create(data) {
    try {
        return Transaction.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(data, id) {
    try {
        data.updated = sequelize.fn('NOW');
        return Transaction.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function wallet(user_id) {
    try {
        return Account.findOne({
            where: {
                user_id,
                is_primary: true,
            }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function debit(data, id) {
    try {
        return Account.update(data, {
            where: { id }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    update,
    debit,
    wallet,
}
