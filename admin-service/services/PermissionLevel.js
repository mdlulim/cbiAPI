// const sequelize = require('../config/db');
const {PermissionLevel } = require('../models/PermissionLevel');

/**
 * Create a new permission level
 * @param {*} query 
 * @returns 
 */
async function create(data) {
    try {
        const permission_level = await PermissionLevel.create(data);
        return {
            success: true,
            data: permission_level
        };
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

/**
 * Get a list of permission levels that have been created.
 * @param {*} query 
 * @returns 
 */
async function index(query) {
    console.log(query);
    try {
        const { offset, limit } = query;
        const where = query || {};

        delete where.offset;
        delete where.limit;

        return PermissionLevel.findAndCountAll({
            where,
            order: [['created', 'DESC']],
            offset: offset || 0,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
};

/**
 * Get a single of permission level that has been created.
 * @param {string} id 
 * @returns 
 */
async function show(id) {
    try {
        const permission_level = await PermissionLevel.findOne({
            where: { id },
        });
        return {
            success: true,
            data: permission_level,
        };
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

/**
 * Update the permission level’s details.
 * @param {string} id 
 * @param {object} data 
 * @returns 
 */
async function update(id, data) {
    
    try {
        return PermissionLevel.update(data, {
            where: { id },
        });
        // return permission level.update(data, { where: { id } });
    } catch (error) {
        console.log(error);
        res.send(err);
    }
};

/**
 * Delete the permission level.
 * @param {string} id 
 * @returns 
 */
async function destroy(id) {
    try {
        await PermissionLevel.destroy({
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
 * 
 * Archived Role
 * 
 * Archived company’s role.
 * 
 * @param {string} id
 * @returns 
 */
 async function archive(id) {
    try {
        return PermissionLevel.update({
            archived: true,
            updated: sequelize.fn('NOW'),
        }, { where: { id } });
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
    archive,
}
