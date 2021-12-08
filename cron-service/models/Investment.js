const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Investment = sequelize.define('investment', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: Sequelize.UUID,
    product_id: Sequelize.UUID,
    invested_amount: Sequelize.FLOAT,
    accumulated_amount: Sequelize.FLOAT,
    daily_interest: Sequelize.FLOAT,
    currency_code: Sequelize.STRING,
    fees: Sequelize.JSONB,
    metadata: Sequelize.JSONB,
    status: Sequelize.STRING,
    start_date: Sequelize.DATE,
    end_date: Sequelize.DATE,
    created: Sequelize.DATE,
    last_updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    Investment,
}
