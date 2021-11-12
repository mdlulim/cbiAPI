const sequelize = require('../config/db');
const { Country } = require('../models/Country');

async function index() {
    try {
        const countries = await Country.findAndCountAll({
            where: {
                blacklisted: false,
            },
        });
        return countries;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function blacklist(id) {
    try {
        return Country.update({ blacklisted: true }, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function unblacklist(id) {
    try {
        return Country.update({ blacklisted: false }, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    index,
    blacklist,
    unblacklist,
}