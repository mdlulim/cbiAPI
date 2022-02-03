const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const MemberProduct = sequelize.define('member_product', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
	user_id: Sequelize.UUID,
	entity: Sequelize.STRING,
	value: Sequelize.FLOAT,
	code: Sequelize.STRING,
	start_date: Sequelize.DATE,
	end_date: Sequelize.DATE,
	created: Sequelize.DATE,
	updated: Sequelize.DATE,
	status: Sequelize.STRING,
}, {
    timestamps: false
});

module.exports = {
    MemberProduct,
}