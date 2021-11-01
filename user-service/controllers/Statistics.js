
async function index(req, res) {
    try {
        return res.send({
            success: true,
            data: {
                balance: 0,
                withdrawals: 0,
                income: 0,
                referrals: 0,
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
