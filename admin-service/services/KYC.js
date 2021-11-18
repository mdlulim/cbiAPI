// const sequelize = require('../config/db');
const { User } = require('../models/User');
const { KYC } = require('../models/KYC');

KYC.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        return KYC.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id) {
    try {
        return KYC.findAll({
            where: {
                user_id: id
            },
            order: [['level','ASC']]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show_all() {
    try {
        return KYC.findAll({
            group: ['user_id'],
            order: [['level','ASC']]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(data, id) {
    try {
        return KYC.update(data, {
            where: { id }
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    show,
    update,
    show_all
}
