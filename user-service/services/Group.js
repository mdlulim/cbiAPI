const Role = require('../models/userRole').Role;

const addRole = role => Role.create(role);

// retrieve all branchs
const getUserRoles = (filters) => Role.findAndCountAll({
        attributes: [
            'id',
            'name',
            'label',
            'description',
            'is_default',
            'is_public',
            'settings',
            'archived',
            'created',
            'updated',
        ],
        order: [['created', 'DESC']],
        offset: (filters.offset) ? filters.offset : 0,
        limit: (filters.limit) ? filters.limit : 50,
    })
    .then(res => {
        return {
            status: "success",
            data: {
                count: res.count,
                next: null,
                previous: null,
                results: res.rows,
                filters
            }
        };
    });

// get branch by id
const getUserRole = (id) => Role.findOne({
        attributes: [
            'id',
            'name',
            'label',
            'description',
            'is_default',
            'is_public',
            'settings',
            'archived',
            'created',
            'updated',
        ],
        where: { id },
    })
    .then(res => {
        return {
            status: "success",
            data: res,
        };
    });

// delete branch by id    
const deleteUserRole = id => Role.destroy({ where: { id } });

module.exports = {
    addRole,
    getUserRoles,
    getUserRole,
    deleteUserRole,
}