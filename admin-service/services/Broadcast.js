const sequelize = require('../config/db');
const { Op } = require("sequelize");
const { Broadcast } = require('../models/Broadcast');
const { Group } = require('../models/Group');


async function index(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};

        delete where.offset;
        delete where.limit;

        var { rows, count } = await Broadcast.findAndCountAll({
            where,
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
        });

        for(var i=0; i < rows.length; i++){
            const res = await Group.findAll({ where: { id: { [Op.in]: rows[i].dataValues.audience } } })
            rows[i].dataValues.audience = res
        }
        
        return { rows, count }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}
// async function show(req, res) {
//     try {
//         return userService.show(req.params.id)
//             .then(data => res.send(data))
//             .catch(err => {
//                 res.send({
//                     success: false,
//                     message: err.message,
//                 });
//             });
//     } catch (error) {
//         return res.send({
//             success: false,
//             message: 'Could not process request'
//         });
//     }
// }

async function update(id, data) {
    try {
        return Broadcast.update(data, { where: { id } })
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}


async function create(data, user) {
    try {
        data['author'] = user.id
        const group = await Broadcast.create(data);
        return {
            success: true,
            message: 'Successfully created!'
        };
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}

async function audience(query) {
    try {
        const where = query || {};
        where['archived'] = false
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
module.exports = {
    index,
    update,
    create,
    audience,
}
