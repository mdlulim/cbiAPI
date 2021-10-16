module.exports = (sequelize, type) => {
    return sequelize.define(
        'currency',
        {
            code: {
                type: type.STRING,
                primaryKey: true,
            },
            description: type.STRING,
            symbol: type.STRING,
            unit: type.STRING,
            divisibility: type.INTEGER,
            company_id: type.UUID,
            type: type.STRING,
            archived: type.BOOLEAN,
            created: type.DATE,
            updated: type.DATE,
        }, {
            timestamps: false
        }
    )
};
