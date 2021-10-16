const groupController = require('./controllers/Group');
const userController = require('./controllers/User');
const authMiddleware = require('./middlewares/auth');

module.exports.set = app => {
    /**
     * Create User
     * 
     * Create a user.
     */
    app.post('/admin/users', authMiddleware.checkAuth, userController.create);

    /**
     * List Users
     * 
     * Get a list of users belonging to CBI.
     */
    app.get('/admin/users', authMiddleware.checkAuth, userController.index);

    /**
     * Retrieve User
     * 
     * Retrieve a company’s user.
     */
    app.get('/admin/users', authMiddleware.checkAuth, userController.show);

    /**
     * Groups
     * 
     * CBI inclused a group management system, that
     * allows admin users to create groups as well
     * as individually manage users’ permissions to
     * view, add, edit or delete data from the system
     * via admin endpoints.
     */
    app.post('/admin/groups', authMiddleware.checkAuth, groupController.create);
    app.get('/admin/groups', authMiddleware.checkAuth, groupController.index);
    app.get('/admin/groups/:id', authMiddleware.checkAuth, groupController.show);
    app.put('/admin/groups/:id', authMiddleware.checkAuth, groupController.update);
    app.delete('/admin/groups/:id', authMiddleware.checkAuth, groupController.destroy);
};
