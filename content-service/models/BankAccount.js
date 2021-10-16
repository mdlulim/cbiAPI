module.exports = (sequelize, type) => {
    return sequelize.define(
        'bank_account',
        {
            id: {
                type: type.UUID,
                defaultValue: type.UUIDV4,
                primaryKey: true,
            },
            user_id: type.UUID,
            name: type.STRING,
            number: type.STRING,
            type: type.STRING,
            bank_name: type.STRING,
            bank_code: type.STRING,
            branch_code: type.STRING,
            currency_code: type.STRING,
            swift: type.STRING,
            iban: type.STRING,
            bic: type.STRING,
            archived: type.BOOLEAN,
            created: type.DATE,
            updated: type.DATE,
        }, {
            timestamps: false,
        }
    )
};
