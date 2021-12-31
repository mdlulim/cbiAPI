const sequelize = require('../config/db');
const { Password } = require('../models/Password');
const { User } = require('../models/User');

Password.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
User.hasMany(Password, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        return Password.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(condition) {
    try {
        const where = condition;
        return Password.findOne({ where });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function index(condition) {
    try {
        const where = condition;
        return Password.findAll({
            where,
            order: [[ 'created', 'DESC' ]]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function count(condition) {
    try {
        const where = condition;
        return Password.count({
            where,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroy(condition) {
    try {
        return Password.destroy({ where: condition });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    show,
    index,
    count,
    destroy,
}