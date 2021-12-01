const productService = require('../services/Product');
const transactionService = require('../services/Transaction');
const userService = require('../services/User');

async function index(req, res) {
    try {
        const referrals = await userService.countReferrals(req.user.id);
        const withdrawals = await transactionService.withdrawals(req.user.id);
        const tokens = await productService.tokens(req.user.id);
        return res.send({
            success: true,
            data: {
                referrals,
                withdrawals: withdrawals || 0,
                tokens: tokens || 0,
                balance: 0,
                income: 0,
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
