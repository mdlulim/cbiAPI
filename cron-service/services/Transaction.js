const sequelize = require('../config/db');
const { Transaction }  = require('../models/Transaction');
const { User }  = require('../models/User');

User.hasMany(Transaction, { foreignKey: 'user_id', targetKey: 'id' });
Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

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
        return Transaction.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    update,
}
