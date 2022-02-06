// const sequelize = require('../config/db');
const { User } = require('../models/User');
const { KYC } = require('../models/KYC');
const sequelize = require('../config/db');


KYC.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function create(data) {
    try {
        return KYC.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id) {
    try {
        return KYC.findAll({
            where: { user_id: id },
            order: [['level', 'ASC']]
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function all() {
    try {
        const records = await KYC.findAll({
            attributes: [
                'level',
                'status'
            ],
        })

        let data = {
            level_0: {
                total: 0,
                rejected: 0,
                approved: 0,
                pending: 0
            },
            level_1: {
                total: 0,
                rejected: 0,
                approved: 0,
                pending: 0
            },
            level_2: {
                total: 0,
                rejected: 0,
                approved: 0,
                pending: 0
            },
            level_3: {
                total: 0,
                rejected: 0,
                approved: 0,
                pending: 0
            }
        }

        if (records.length) {
            records.forEach(row => {
                if (row.level === '0') {
                    data.level_0.total += 1

                    if (row.status === 'Pending') {
                        data.level_0.pending += 1
                    } else if (row.status === 'Rejected') {
                        data.level_0.rejected += 1
                    } else if (row.status === 'Approved') {
                        data.level_0.approved += 1
                    }
                } else if (row.level === '1') {
                    data.level_1.total += 1

                    if (row.status === 'Pending') {
                        data.level_1.pending += 1
                    } else if (row.status === 'Rejected') {
                        data.level_1.rejected += 1
                    } else if (row.status === 'Approved') {
                        data.level_1.approved += 1
                    }
                } else if (row.level === '2') {
                    data.level_2.total += 1

                    if (row.status === 'Pending') {
                        data.level_2.pending += 1
                    } else if (row.status === 'Rejected') {
                        data.level_2.rejected += 1
                    } else if (row.status === 'Approved') {
                        data.level_2.approved += 1
                    }
                } else if (row.level === '3') {
                    data.level_3.total += 1

                    if (row.status === 'Pending') {
                        data.level_3.pending += 1
                    } else if (row.status === 'Rejected') {
                        data.level_3.rejected += 1
                    } else if (row.status === 'Approved') {
                        data.level_3.approved += 1
                    }
                }
            })
        }

        return data


    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function pending() {
    try {
        const data = await KYC.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('user_id')), 'user_id']],
            where: { status: 'Pending' }
        });

        let dataArr = []

        data.forEach(row => {
            dataArr.push(row.user_id)
        })

        return User.findAll({
            where: {
                id: dataArr
            }
        })
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(data) {
    try {
        const result = await sequelize.transaction(async (t) => {
            const levels_to_update = Object.keys(data);

            levels_to_update.forEach(async (i) => {
                const id = data[i].id
                delete data[i].id
                await KYC.update(data[i], { where: { id }, transaction: t });
            });
        });

        return result;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    create,
    show,
    update,
    pending,
    all
}
