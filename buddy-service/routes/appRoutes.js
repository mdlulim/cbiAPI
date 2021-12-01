module.exports = app => {
    app.get('/lookupbalance', (req,res) => {
        res.send({ message: 'this is the root route'})
    });

    app.get('/lookupaccount', (req,res) => {
        res.send({ message: 'this is the root route'})
    });

    app.get('/lookuptransactions', (req,res) => {
        res.send({ message: 'this is the root route'})
    });

    app.get('/eventtransfer', (req,res) => {
        res.send({ message: 'this is the root route'})
    });
}