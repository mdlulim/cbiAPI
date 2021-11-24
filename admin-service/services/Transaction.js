const sequelize = require('../config/db');
const { Transaction } = require('../models/Transaction');
const { User } = require('../models/User');
const { Document } = require('../models/Document');
const { Account }  = require('../models/Account');

async function index(query) {
    try {
        const { offset, limit } = query;
        const where = query || {};

        delete where.offset;
        delete where.limit;

        return Transaction.findAndCountAll({
            where,
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
        const where = {
            ...query,
            user_id,
        };
        const { count, rows } = await User.findAndCountAll({
            where,
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

module.exports = {
    index,
    show,
    create,
    update,
    creditWallet,
    debitWallet,
    allTransactions,
    getProofOfPayment
}