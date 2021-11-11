// const sequelize = require('../config/db');
const { PagePermission } = require('../models/PagePermission');

/**
 * Create a new group
 * @param {*} query 
 * @returns 
 */
async function create(data) {
    try {
        const page_permission = await PagePermission.create(data);
        return {
            success: true,
            data: page_permission
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
        const groups = await PagePermission.findAll({
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
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
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
    
    console.log('THABIOS '+id);
    try {
        return Group.update(data, {
            where: { id },
        });
        // return Group.update(data, { where: { id } });
    } catch (error) {
        console.log(error);
        res.send(err);
    }
    // try {
    //     await Group.update(data, {
    //         where: { id },
    //     });
    //     return {
    //         success: true,
    //     };
    // } catch (err) {
    //     console.log(err);
    //     res.send(err);
    // } 
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
        return Group.update({
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
