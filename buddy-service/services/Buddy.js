
async function lookupaccount() {
    try {
        data = {
            status: 200,
            message: 'this route is working'
        }
        return data;
    } catch (e) {
        return { error: { message: e.error }}
    }
}

module.exports = {
    lookupaccount
}