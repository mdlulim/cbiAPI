const broadcastService = require('../services/Broadcast');

async function index(req, res) {
    try {
        const messages = await broadcastService.index(req.user);
        return res.send({
            success: true,
            data: {
                results: messages,
            },
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        })
    }
};

module.exports = {
    index,
};
