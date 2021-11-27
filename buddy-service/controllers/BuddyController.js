const buddyService = require('../services/Buddy');

function lookupaccount(req, res) {
    try {
        const data = lookupaccount()
        res.send(data);
    } catch (e) {
        console.log('error')
        return { error: { message: e.error }}
    }
}

module.exports = {
    lookupaccount
}