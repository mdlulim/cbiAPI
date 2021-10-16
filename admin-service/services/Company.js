const Companies = require('../models/company').Company;

const addCompany = company => Companies.create(company);

// change user's password
const updateProfile = (id, data) => Companies.update(data, { where: { id } })
.then(res => {
    return {
        status: "success",
    };
});

// get all companies
const getAll = (filters) => Companies.findAndCountAll({
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
                results: res.rows
            }
        };
    });

// get single company record
const getById = id => Companies.findOne({
        where: { id },
    })
    .then(res => {
        return {
            status: "success",
            data: res
        };
    });

module.exports = {
    addCompany,
    updateProfile,
    getAll,
    getById,
}
