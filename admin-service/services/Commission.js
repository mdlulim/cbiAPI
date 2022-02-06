const sequelize = require('../config/db');
const { Commission } = require('../models/Commission');
const { CommissionPayout } = require('../models/CommissionPayout');

async function create(data) {
    try {
        return Commission.create(data);
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function bulkCreate(data) {
    try {
        return Commission.bulkCreate(data);
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function createPayout(data) {
    try {
        return CommissionPayout.create(data);
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function updatePayout(id, data) {
    try {
        return CommissionPayout.update(data, { where: { id } });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    create,
    bulkCreate,
    createPayout,
    updatePayout,
};