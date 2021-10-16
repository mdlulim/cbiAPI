const userService = require('../services/user');

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

module.exports = {
    profile,
};
