const sequelize = require('../config/db');
const { User } = require('../models/User');
const { Transaction }  = require('../models/Transaction');
const { Fee }  = require('../models/Fee');
const { Account }  = require('../models/Account');
Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });


async function process(transaction) {
    try {

            if(data.subtype.toLowerCase() === "withdrawal"){
                const user =  await User.findOne({where : {referral_id: transaction.referral_id}});
                const userAccount =  await Account.findOne({where : {user_id: user.id}});
                const fee =  await Fee.findOne({where : {subtype: transaction.subtype.charAt(0).toUpperCase() + transaction.subtype.slice(1), group_id: user.dataValues.group_id} });
                const withdrawalAmount = parseFloat(transaction.amount)+parseFloat(fee.dataValues.value)

                if(transaction.status === 1){
                    const myData = {status: 'Completed'}
                    await Transaction.update(myData, {
                        where: { txid: transaction.txid }
                    });

                }else{
                    //reject transaction
                    //in progress
                    let credit = {available_balance: parseFloat(userAccount.available_balance)+withdrawalAmount};
                    let condition = {id: userAccount.id}
                    Account.update( credit, {where: condition})
                    const myData = {status: 'Rejected'}
                    await Transaction.update(myData, {
                        where: { txid: transaction.txid }
                    });
                }
            }
            return { success: true, message: 'Transaction was succefully modify' };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

/**
 * List Users
 * 
 * Get a list of users belonging to CBI.
 * 
 * @param {object} query
 * @returns
 */
async function status(query) {
    try {
        const users = await User.findAndCountAll({
        });
        const { count, rows } = users;
        return {
            success: true,
            data: {
                count,
                results: rows,
            }
        };
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    process,
    status,
}
