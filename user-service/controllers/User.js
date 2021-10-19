const userService = require('../services/User');

async function profile(req, res) {
    try {
        const user = await userService.show(req.user.id);
        return res.send({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function referrals(req, res) {
    try {
        const referrals = await userService.referrals(req.user.id);
        const { count, rows } = referrals;
        return res.send({
            success: true,
            data: {
                count,
                results: rows,
            },
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    profile,
    referrals,
};
