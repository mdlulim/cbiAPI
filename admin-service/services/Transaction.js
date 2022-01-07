const sequelize = require('../config/db');
const { Transaction } = require('../models/Transaction');
const { User } = require('../models/User');
const { Document } = require('../models/Document');
const { Account }  = require('../models/Account');

User.hasMany(Transaction, {foreignKey: 'user_id', targetKey: 'id'});
Transaction.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});

async function index(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};
        const userWhere = {};
        delete where.offset;
        delete where.limit;

        if (where.user) {
            userWhere.id = where.user;
            delete where.user;
        }

        return Transaction.findAndCountAll({
            where,
            include: [{ model: User, where: userWhere }],
            order: [['created', 'DESC']],
            offset: offset || 0,
            limit: limit || 100,
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
    
}

async function show(id) {
    try {
        return Transaction.findOne({
            where: { id },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function create(data) {
    try {
        return Transaction.create(data);
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request of creating request');
    }
}

async function creditWallet(id, data) {
    try {
        const account =  await Account.findOne({where : {id: data.account_id}});
        const mainAccount =  await Account.findOne({where : {id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'}});
            if(account){
                let credit = {available_balance: parseFloat(account.available_balance)+parseFloat(data.amount)};
                let accountCondition = {id: data.account_id}
                Account.update( credit,{where: accountCondition})
            }

            if(mainAccount){
                let debit = {available_balance: parseFloat(mainAccount.available_balance)-parseFloat(data.amount)};
                let mainAccountCondition = {id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'}
                Account.update(debit, {where: mainAccountCondition})
            }
        return { success: true };
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

async function debitWallet(id, data) {
    try {
        const account =  await Account.findOne({where : {id: data.account_id}});
        const mainAccount =  await Account.findOne({where : {id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'}});
            if(account){
                let debit = {available_balance: parseFloat(account.available_balance)-parseFloat(data.amount)};
                let accountCondition = {id: data.account_id}
                Account.update( debit,{where: accountCondition})
            }

            if(mainAccount){
                let credit = {available_balance: parseFloat(mainAccount.available_balance)+parseFloat(data.amount)};
                let mainAccountCondition = {id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'}
                Account.update( credit, {where: mainAccountCondition})
            }
        return { success: true };
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}


async function update(data, id) {
    try {
        return Transaction.update(data, { where: { id } });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function allTransactions(user_id, query) {
    try {

        const { count, rows } = await User.findAndCountAll({
            order: [[ 'created', 'DESC' ]],
            include: Transaction
        });
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
    }
}

async function getProofOfPayment(txid) {
    try {
        return Document.findAndCountAll({
            where: { 'metadata': {'txid': txid}},
            order: [['created', 'DESC']]
        });
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

async function transactions(query, data) {
    try {
        const { offset, limit } = query;
        const where = query || {};
        const userWhere = {};
        delete where.offset;
        delete where.limit;

        if (where.user) {
            userWhere.id = where.user;
            delete where.user;
        }
        const Op = sequelize.Op;
        return Transaction.findAndCountAll({
            where: {
                status: "Completed",
                created: { [Op.between]: [data.start_date, data.end_date] },  },
            include: [
                {
                    attributes: [
                        'first_name',
                        'last_name',
                        'referral_id',
                        'email',
                        'id',
                    ],
                    model: User, 
                    where: userWhere }],
            order: [['created', 'DESC']]
        });
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

async function transactionstotal(data) {
    const dateRange = data;
    try {
        const Op = sequelize.Op;
       const  deposit = await Transaction.sum('fee', {
            where: {
                subtype: "deposit",
                status: "Completed",
                created: { [Op.between]: [dateRange.start_date, dateRange.end_date] },
             }
        })
        const  withdrawal = await Transaction.sum('fee', {
            where: {
                subtype: "withdrawal",
                status: "Completed",
                created: { [Op.between]: [dateRange.start_date, dateRange.end_date] },
             }
        })

        const  transfer = await Transaction.sum('fee', {
            where: {
                subtype: "transfer",
                status: "Completed",
                created: { [Op.between]: [dateRange.start_date, dateRange.end_date] },
         }
        })

        const  product = await Transaction.sum('fee', {
            where: {
                subtype: "product",
                status: "Completed",
                created: { [Op.between]: [dateRange.start_date, dateRange.end_date] },
         },
        })
        const  registration = await Transaction.sum('amount', {
            where: {
                subtype: "registration",
                status: "Completed",
                created: { [Op.between]: [dateRange.start_date, dateRange.end_date] },
             }
        })
        const data = {
            deposit     : deposit ? deposit : 0,
            withdrawal  : withdrawal ? withdrawal: 0,
            transfer    : transfer ? transfer : 0,
            product     : product ? product: 0,
            registration: registration ? registration: 0,
            total       : (deposit ? deposit : 0) + (withdrawal ? withdrawal: 0) + (transfer ? transfer : 0) + (product ? product: 0)
        }
        return { data: data }
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}





module.exports = {
    index,
    show,
    create,
    update,
    creditWallet,
    debitWallet,
    allTransactions,
    getProofOfPayment,
    transactions,
    transactionstotal
}