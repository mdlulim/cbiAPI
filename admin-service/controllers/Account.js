const accountService = require('../services/Account');

async function wallet(req, res) {
    try {
        const account = await accountService.wallet(req.params.id);
        return res.send({
            success: true,
            data: account
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    wallet,
};