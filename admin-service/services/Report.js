const sequelize = require('../config/db');
const { Group } = require('../models/Group');
const { Report } = require('../models/Report');
const { User } = require('../models/User');

User.belongsTo(Group, { foreignKey: 'group_id', targetKey: 'id' });

Report.belongsTo(User, { foreignKey: 'created_by', targetKey: 'id', as: 'report_creator' });
User.hasMany(Report, { foreignKey: 'created_by', targetKey: 'id', as: 'report_creator' });

Report.belongsTo(User, { foreignKey: 'updated_by', targetKey: 'id', as: 'report_updator' });
User.hasMany(Report, { foreignKey: 'updated_by', targetKey: 'id', as: 'report_updator' });

async function index(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};

        delete where.offset;
        delete where.limit;

        return Report.findAndCountAll({
            where,
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
            include: [{
                attributes: [
                    'id',
                    'first_name',
                    'last_name',
                ],
                model: User,
                required: true,
                as: 'report_creator',
                include: [{ model: Group }]
            }, {
                attributes: [
                    'id',
                    'first_name',
                    'last_name',
                ],
                model: User,
                required: false,
                as: 'report_updator',
                include: [{ model: Group }]
            }]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id) {
    try {
        return Report.findOne({
            where: { id },
            include: [{
                attributes: [
                    'id',
                    'first_name',
                    'last_name',
                ],
                model: User,
                required: true,
                as: 'report_creator',
                include: [{ model: Group }]
            }, {
                attributes: [
                    'id',
                    'first_name',
                    'last_name',
                ],
                model: User,
                required: false,
                as: 'report_updator',
                include: [{ model: Group }]
            }]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function generate(id) {
    try {
        const options = {
            nest: true,
            replacements: {},
            type: sequelize.QueryTypes.SELECT,
        };
        //const report = await Report.findOne({ where: { id } });
        const sql = "SELECT users.id, users.first_name, users.last_name, users.username, wealth_creators.frequency, wealth_creators.status, wealth_creators.last_payment_date, wealth_creators.updated, wealth_creators.last_paid_amount, groups.label"+
        " FROM users"+
        " LEFT JOIN wealth_creators ON wealth_creators.user_id = users.id"+
        " LEFT JOIN groups ON groups.id = users.group_id"+
        " WHERE groups.label = 'Wealth Creator'"+
        " ORDER BY wealth_creators.last_paid_amount ASC";
        const rslt = sequelize.query(sql, options);
        return rslt;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    index,
    show,
    generate,
}
