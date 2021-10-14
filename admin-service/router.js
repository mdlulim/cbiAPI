const userController = require('./controllers/user');

module.exports.set = app => {
    // app.post('/users', userController.create);
    app.get('/admin/users', userController.index);
    // app.get('/users/:id', userController.show);
    // app.put('/users/:id', userController.update);
    // app.delete('/users/:id', userController.destroy);
};
