const { Fee }  = require('../models/Fee');
const { Commission }  = require('../models/Commission');
const { Group }  = require('../models/Group');

async function create(data) {
    try {
        return Fee.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * List Fees
 * 
 * Get a list of fees belonging to CBI.
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
            groupWhere.id = where.group;
            delete where.group;
        }

        const fees = await Fee.findAndCountAll({
            attributes: [
                'id',
                'tx_type',
                'value',
                'percentage',
                'subtype',
                'currency_code',
                'group_id',
                'archived',
                'created',
                'updated',
            ],
            where,
            include: [
                {
                    attributes: [
                        'id',
                        'name',
                        'label',
                    ],
                    model: Group, 
                    where: groupWhere }],
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
        });
        const { count, rows } = fees;
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
 * Retrieve Fee
 * 
 * Retrieve a company’s fee.
 * 
 * @param {string} id 
 * @returns 
 */
async function show(id) {
    try {
        const fee = await Fee.findOne({
            attributes: [
                'id',
                'tx_type',
                'value',
                'percentage',
                'subtype',
                'group_id',
                'archived',
                'currency_code',
                'created',
                'updated',
            ],
            where: { id },
        });
        return {
            success: true,
            data: fee,
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * 
 * Update Fee
 * 
 * Update company’s fee details.
 * 
 * @param {string} id
 * @param {string} data 
 * @returns 
 */
async function update(id, data) {
    try {
        return Fee.update(data, { where: { id } });
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
}
