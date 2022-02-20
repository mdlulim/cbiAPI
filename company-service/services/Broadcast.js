const sequelize = require('../config/db');

async function index(user) {
    try {
        const options = {
            nest: true,
            replacements: {},
            type: sequelize.QueryTypes.SELECT,
        };
        const sql = `
        SELECT 
            id,
            body,
            title,
            status,
            author,
            expiry,
            created,
            updated,
            summary,
            publisher,
            published,
            audience,
            image
        FROM broadcasts
        WHERE '${user.group_id}' = ANY(audience)`;
        return sequelize.query(sql, options);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    index,
}
