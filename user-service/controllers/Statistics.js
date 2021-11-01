const transactionService = require('../services/Transaction');
const userService = require('../services/User');

async function index(req, res) {
    try {
        const referrals = await userService.countReferrals(req.user.id);
        const withdrawals = await transactionService.withdrawals(req.user.id);
        return res.send({
            success: true,
            data: {
                balance: 0,
                withdrawals,
                income: 0,
                referrals,
            },
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    index,
};
