const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const KYC = sequelize.define('kyc', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    user_id: { type: Sequelize.UUID, unique: 'kycs_user_id_level_key'},
	level: { type: Sequelize.INTEGER, unique: 'kycs_user_id_level_key'},
	data: Sequelize.JSONB,
	documents: Sequelize.JSONB,
	status: Sequelize.STRING,
	verified: Sequelize.BOOLEAN,
	verification_date: Sequelize.DATE,
	verified_by: Sequelize.UUID,
    created: Sequelize.DATE,
	created: Sequelize.DATE,
	updated: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = {
    KYC,
}
