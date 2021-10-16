const Session = require('../models/Session').Session;

const addSession = session => Session.create(session);

// get all sessions by user
const getTokensByUser = (userId) => Session.findAll({
        attributes: [
            'token',
            'duration',
            'expires',
        ],
        where: { user_id: userId },
    })
    .then(res => {
        return {
            status: "success",
            data: res,
        };
    });

// log out user from all sessions
const logoutAll = (userId) => Session.update({
        logout: new Date(),
    }, { where: { user_id: userId, logout: null } })
    .then(res => {
        return {
            status: "success",
            data: res,
        };
    });

// log out user from latest session
const logout = (userId, token) => Session.update({
        logout: new Date(),
    }, { where: {
        user_id: userId,
        logout: null,
        token: token,
    }})
    .then(res => {
        return {
            status: "success",
            data: res,
        };
    });

module.exports = {
    addSession,
    getTokensByUser,
    logoutAll,
    logout,
}