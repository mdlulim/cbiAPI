const sequelize = require('../config/db');
const { Company }  = require('../models/Company');
const { Currency } = require('../models/Currency');
const { Setting }  = require('../models/Setting');
const { CompanyBankAccount } = require('../models/CompanyBankAccount');
const { CompanyCryptoAccount } = require('../models/CompanyCryptoAccount');

Currency.belongsTo(Company, { foreignKey: 'company_id', targetKey: 'id' });
Setting.belongsTo(Company, { foreignKey: 'company_id', targetKey: 'id' });
CompanyBankAccount.belongsTo(Company, { foreignKey: 'company_id', targetKey: 'id' });
CompanyCryptoAccount.belongsTo(Company, { foreignKey: 'company_id', targetKey: 'id' });

async function profile(id) {
    try {
        const company = await Company.findOne(data, {
            where: { id },
        });
        return company;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function currencies(company_id) {
    try {
        const currencies = await Currency.findAndCountAll({
            where: { company_id },
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
        });
        const { count, rows } = currencies;
        return {
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function bankAccounts() {
    try {
        const { Op } = sequelize;
        const bankAccounts = await CompanyBankAccount.findAndCountAll({
            where: {
                status: {
                    [Op.iLike]: 'Active'
                }
            },
        });
        const { count, rows } = bankAccounts;
        return {
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        };
    } catch (error) {
        console.error('error: ');
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function cryptoAccounts() {
    try {
        const { Op } = sequelize;
        const cryptoAccounts = await CompanyCryptoAccount.findAndCountAll({
            where: {
                status: {
                    [Op.iLike]: 'Active'
                }
            },
        });
        const { count, rows } = cryptoAccounts;
        return {
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function settings(company_id, query) {
    try {
        const where = query || {};
        where.company_id = company_id;
        const settings = await Setting.findAndCountAll({
            where,
        });
        const { count, rows } = settings;
        return {
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    profile,
    currencies,
    bankAccounts,
    cryptoAccounts,
    settings,
}
