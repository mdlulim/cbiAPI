const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Commission = sequelize.define('commission', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    type: Sequelize.STRING,
    referral_id: Sequelize.UUID,
    amount: Sequelize.FLOAT,
    status: Sequelize.STRING,
    archived: Sequelize.BOOLEAN,
    currency_code: Sequelize.STRING,
    commission_date: Sequelize.DATE,
	metadata: Sequelize.JSONB,
    created: Sequelize.DATE,
    updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Commission,
}