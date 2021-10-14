// const sequelize = require('../config/db');
const { User } = require('../models/user');

// get all users
const index = () => User.findAndCountAll({
    order: [['created', 'DESC']],
})
.then(res => {
    return {
        status: "success",
        data: {
            count: res.count,
            next: null,
            previous: null,
            results: res.rows,
        }
    };
});

module.exports = {
    index
}
