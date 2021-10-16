const groupController = require('./controllers/Group');
const userController = require('./controllers/User');

module.exports.set = app => {
    /**
     * Create User
     * 
     * Create a user.
     */
    app.post('/admin/users', userController.create);

    /**
     * List Users
     * 
     * Get a list of users belonging to CBI.
     */
    app.get('/admin/users', userController.index);

    /**
     * Groups
     * 
     * CBI inclused a group management system, that
     * allows admin users to create groups as well
     * as individually manage users’ permissions to
     * view, add, edit or delete data from the system
     * via admin endpoints.
     */
    app.post('/admin/groups', groupController.create);
    app.get('/admin/groups', groupController.index);
    app.get('/admin/groups/:id', groupController.show);
    app.put('/admin/groups/:id', groupController.update);
    app.delete('/admin/groups/:id', groupController.destroy);
};
