const sequelize = require('../config/db');
const { MobileNumber } = require('../models/MobileNumber');
const { User } = require('../models/User');

async function create(data) {
    try {
        return MobileNumber.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function index(user_id) {
    try {
        return MobileNumber.findAndCountAll({
            where: { user_id },
            order: [['created', 'DESC']],
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id) {
    try {
        return MobileNumber.findOne({
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function findByNumber(number) {
    try {
        return MobileNumber.findOne({
            where: { number },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(req, data) {
    try {
        const { fn } = sequelize;
        const { id } = req.params;
        data.updated = fn('NOW');

        if (id === 'primary') {
            data.is_primary  = true;
            data.is_verified = true;
            await MobileNumber.update(data, {
                where: {
                    is_primary: true,
                    user_id: req.user.id,
                }
            });
            const { number } = req.body;
            return User.update({
                updated: fn('NOW'),
                mobile: number,
            }, { id: req.user.id });
        }
        return MobileNumber.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroy(id) {
    try {
        return MobileNumber.destroy({ where: { id } });
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
    findByNumber,
}
