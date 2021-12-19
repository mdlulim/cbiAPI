const sequelize = require('../config/db');
const { User } = require('../models/User');
const { Transaction } = require('../models/Transaction');
const { Fee } = require('../models/Fee');
const { BatchTransaction } = require('../models/BatchTransaction');
const { Account } = require('../models/Account');
Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

async function showTransaction(data) {
    try {
        return Transaction.findOne({
            where: { txid: data.txid },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function showFile(data) {
    try {
        return Transaction.findOne({
            where: { txid: data.txid },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function process(data) {
    try {
        if (data.subtype.toLowerCase() === "withdrawal") {
            const user = await User.findOne({ where: { referral_id: data.referral_id } });
            const userAccount = await Account.findOne({ where: { user_id: user.id } });
            const transaction = await Transaction.findOne({ where: { txid: data.txid } });
            const fee = await Fee.findOne({ where: { subtype: data.subtype.charAt(0).toUpperCase() + data.subtype.slice(1).toLowerCase(), group_id: user.dataValues.group_id } });
            const withdrawalAmount = parseFloat(data.amount) + parseFloat(fee.dataValues.value)

            if (parseFloat(data.status) === 0) {
                const myData = { status: 'Completed' }
                if (transaction.dataValues.status != 'Completed') {
                    await Transaction.update(myData, {
                        where: { txid: data.txid }
                    });
                }


            } else {
                //reject transaction
                //in progress
                let credit = { available_balance: parseFloat(userAccount.available_balance) + withdrawalAmount };
                let condition = { id: userAccount.id }
                if (transaction.dataValues.status != 'Completed') {
                    Account.update(credit, { where: condition })
                    const myData = { status: 'Rejected' }
                    await Transaction.update(myData, {
                        where: { txid: data.txid }
                    });
                }
            }
        }
        return { success: true, message: 'Transaction was successfully modify' };
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}

async function updateBatchStatus(id, data) {
    try {
        await BatchTransaction.update({
            file_status: data.status,
            updated: sequelize.fn('NOW'),
        }, { where: { id } });
        return { success: true, message: 'Successfully modify' };
    } catch (error) {
        //console.error(error || null);
        throw new Error('Could not process your request');
    }
}

/**
 * Sets transaction state
  */
async function updateTransaction(data) {
    try {
        const result = await sequelize.transaction(async (t) => {
            data.forEach(async(row) => {
                console.log(row)
                await Transaction.update({
                    status: row.status,
                }, { where: { txid: row.txid }, transaction: t });
            })
        })
        
        return { success: true, message: 'Successfully modified' };
    } catch (error) {
        //console.error(error || null);
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
    showTransaction,
    updateBatchStatus,
    updateTransaction,
}
