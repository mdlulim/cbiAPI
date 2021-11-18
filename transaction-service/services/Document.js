const sequelize = require('../config/db');
const { Document } = require('../models/Document');

async function create(data) {
    try {
        return Document.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function search(prop, value) {
    try {
        const { Op } = sequelize;
        const where = {
            [prop]: {
                [Op.iLike]: value,
            }
        };
        return Document.findAndCountAll({
            where,
            order: [['created', 'DESC']],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function findByCategoryType(category, type, user_id) {
    try {
        const where = {
            category,
            type,
            user_id,
            status: 'Pending',
        };
        return Document.findOne({
            where,
            order: [['created', 'DESC']],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function index(user_id) {
    try {
        return Document.findAndCountAll({
            where: { user_id },
            order: [['created', 'DESC']],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id) {
    try {
        return Document.findOne({
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(id, data) {
    try {
        data.updated = sequelize.fn('NOW');
        return Document.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroy(id) {
    try {
        return Document.destroy(id);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
    search,
    findByCategoryType,
}
