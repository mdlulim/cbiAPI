module.exports = (sequelize, type) => {
    return sequelize.define(
        'crypto_account',
        {
            id: {
                type: type.UUID,
                defaultValue: type.UUIDV4,
                primaryKey: true,
            },
            user_id: type.UUID,
            address: type.STRING,
            code: type.STRING,
            metadata: type.JSON,
            crypto_type: type.STRING,
            status: type.STRING,
            created: type.DATE,
            updated: type.DATE,
            currency_code: type.STRING,
            is_primary: type.BOOLEAN,
            name: type.STRING,
        }, {
            timestamps: false,
        }
    )
};
