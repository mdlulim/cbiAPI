const { Setting }  = require('../models/Setting');


async function create(data) {
    try {
        return Setting.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * List Settings
 * 
 * Get a list of settings belonging to CBI.
 * 
 * @param {object} query
 * @returns
 */
async function index(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};
        const groupWhere = {};

        delete where.offset;
        delete where.limit;

        if (where.group) {
            groupWhere.name = where.group;
            delete where.group;
        }

        const settings = await Setting.findAndCountAll({
            attributes: [
                'id',
                'title',
                'category',
                'key',
                'value',
                'company_id',
                'subcategory',
            ],
            where,
            offset: offset || 0,
            limit: limit || 100,
        });
        const { count, rows } = settings;
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
}

/**
 * Retrieve Setting
 * 
 * Retrieve a company’s setting.
 * 
 * @param {string} id 
 * @returns 
 */
async function show(id) {
    try {
        const setting = await Setting.findOne({
            attributes: [
                'id',
                'title',
                'category',
                'key',
                'value',
                'company_id',
                'subcategory',
            ],
            where: { id },
        });
        return {
            success: true,
            data: setting,
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * 
 * Update Setting
 * 
 * Update company’s setting details.
 * 
 * @param {string} id
 * @param {string} data 
 * @returns 
 */
async function update(id, data) {
    try {
        return Setting.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroy(id) {
    try {
        return Setting.destroy({ where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function findByKey(key) {
    try {
        //console.log(key)
        return  await Setting.findOne({
            where: { key: key }
        });
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
    findByKey,
    destroy
}
