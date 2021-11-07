// const sequelize = require('../config/db');
const { Group } = require('../models/Group');

/**
 * Create a new group
 * @param {*} query 
 * @returns 
 */
async function create(data) {
    try {
        const group = await Group.create(data);
        return {
            success: true,
            data: group
        };
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

/**
 * Get a list of groups that have been created.
 * @param {*} query 
 * @returns 
 */
async function index(query) {
    try {
        const where = query || {};
        const groups = await Group.findAndCountAll({
            where,
            order: [['created', 'DESC']],
        });
        const { count, rows } = groups;
        return {
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        };
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

/**
 * Get a single of group that has been created.
 * @param {string} id 
 * @returns 
 */
async function show(id) {
    try {
        const group = await Group.findOne({
            where: { id },
        });
        return {
            success: true,
            data: group,
        };
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

/**
 * Update the group’s details.
 * @param {string} id 
 * @param {object} data 
 * @returns 
 */
async function update(id, data) {
    try {
        await Group.update(data, {
            where: { id },
        });
        return {
            success: true,
        };
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

/**
 * Delete the group.
 * @param {string} id 
 * @returns 
 */
async function destroy(id) {
    try {
        await Group.destroy({
            where: { id },
        });
        return {
            success: true,
        };
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
}
