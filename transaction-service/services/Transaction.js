const sequelize = require('../config/db');
const { Buddy } = require('../models/Buddy');
const { BuddyTransaction } = require('../models/BuddyTransaction');
const { Document } = require('../models/Document');
const { KYCLimit } = require('../models/KYCLimit');
const { Transaction }  = require('../models/Transaction');
const { User }  = require('../models/User');
const { Setting }  = require('../models/Setting');
const { Account }  = require('../models/Account');

Buddy.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
BuddyTransaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
Document.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });

User.hasMany(Transaction, {foreignKey: 'user_id', targetKey: 'id'});
Transaction.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id'});

async function create(data) {
    try {
        return Transaction.create(data);
    } catch (error) {
        console.error(error.message || null);
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

async function index(user_id, query) {
    try {
        const options = {
            nest: true,
            replacements: {},
            type: sequelize.QueryTypes.SELECT,
        };
        const query = `
        SELECT "transaction".*, "document"."id" AS "document.id", "document"."metadata" AS "document.metadata",
            "document"."file" AS "document.file"
        FROM transactions AS "transaction"
        LEFT OUTER JOIN documents AS "document" ON ("document"."metadata"->>'txid')::TEXT = "transaction"."txid"
        WHERE "transaction"."user_id" = '${user_id}'
        ORDER BY "transaction"."created" DESC`;
        const transactions = await sequelize.query(query, options);

        // count transactions
        const countQuery = `
        SELECT COUNT(*)
        FROM transactions AS "transaction"
        LEFT OUTER JOIN documents AS "document" ON ("document"."metadata"->>'txid')::TEXT = "transaction"."txid"
        WHERE "transaction"."user_id" = '${user_id}' AND "transaction"."status" NOT iLIKE 'Pending'`;
        const count = await sequelize.query(countQuery, options);

        // response
        return {
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: transactions,
            }
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function buddy(user_id, query) {
    try {
        const transactions = await BuddyTransaction.findAndCountAll({
            where: { user_id },
            order: [[ 'created', 'DESC' ]]
        });
        const { count, rows } = transactions;
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

async function count(user_id, txtype, subtype) {
    try {
        const { Op } = sequelize;
        const where = {
            tx_type: { [Op.iLike]: txtype },
            subtype: { [Op.iLike]: subtype },
            user_id,
        };
        let count = 0;
        if (subtype.toLowerCase() === 'buddy') {
            where.subtype = 'TRANSFER';
            count = await BuddyTransaction.count({
                where,
            });
        } else {
            count = await Transaction.count({
                where,
            });
        }
        return {
            success: true,
            data: count || 0,
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function totals(user_id, txtype, subtype) {
    try {
        const { Op } = sequelize;
        const where = {
            tx_type: { [Op.iLike]: txtype },
            subtype: { [Op.iLike]: subtype },
            user_id,
        };
        let total = 0;
        if (subtype.toLowerCase() === 'buddy') {
            total = await BuddyTransaction.sum('amount', {
                where,
            });
        } else {
            total = await Transaction.sum('total_amount', {
                where,
            });
        }
        return {
            success: true,
            data: total || 0,
        };
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function limits(kyc_level) {
    try {
        return KYCLimit.findOne({
            attributes: [
                'level',
                'withdrawal_limit',
            ],
            where: {
                level: kyc_level,
            },
        });
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}


async function approveDeposit(data) {

    //console.log(commissionData)
    try {
        const setting =  await Setting.findOne({where : {key: 'membership_fee'}});
        let sponsorBalance = null;
        let userBalance = null;
        if(parseFloat(data.fiat_amount) < parseFloat(setting.dataValues.value)){
            return { success: false, message: "Insufficient funds" };
        }

        if(data.status_text === 'Completed'){
            // const user =  await User.findOne({where : {id: data.transaction.user_id}});
            // const sponsor =  await User.findOne({where : {id: user.dataValues.sponsor}});
        //console.log(setting)
            const mainAccount =  await Account.findOne({where : {id: '3cf7d2c0-80e1-4264-9f2f-6487fd1680c2'}});
            const userAccount =  await Account.findOne({where : {user_id: user.dataValues.id}});
            const sponsorAccount =  await Account.findOne({where : {user_id: sponsor.dataValues.id}});

            const userTopUp = parseFloat(data.transaction.amount) - parseFloat(setting.dataValues.value)+(parseFloat(setting.dataValues.value)* 25 / 100);

            let companyCondition    = {id: mainAccount.dataValues.id};
            let companyData         = {available_balance: parseFloat(mainAccount.dataValues.available_balance)+(parseFloat(setting.dataValues.value)* 50 / 100)};

            let sponsorCondition    = {id: sponsorAccount.dataValues.id};
            let sponsorData         = {available_balance: parseFloat(sponsorAccount.dataValues.available_balance)+(parseFloat(setting.dataValues.value)* 25 / 100)};
            sponsorBalance          = parseFloat(sponsorAccount.dataValues.available_balance)+(parseFloat(setting.dataValues.value)* 25 / 100);

            let userCondition       = {id: userAccount.dataValues.id};
            let userData            = {available_balance: parseFloat(userAccount.dataValues.available_balance)+userTopUp};
            userBalance             = parseFloat(userAccount.dataValues.available_balance)+userTopUp;

            const user_id = user.dataValues.id;
            let status = {status: data.status}
            await Transaction.update(status, { where: { id } });

            await Account.update(companyData,{ where : companyCondition });

            await Account.update(sponsorData,{ where : sponsorCondition });

            await Account.update(userData,{ where : userCondition });

            await User.update({
                status: 'Active',
                blocked: false,
                archived: false,
                updated: sequelize.fn('NOW'),
            }, { where: { id: user_id } });

            const commissionData ={
                user_id: user.id,
                type: 'REFERRAL',
                referral_id: sponsor.id,
                status: 'Paid',
                amount: parseFloat(setting.value)* 25 / 100,
                currency_code: data.transaction.currency.code,
                commission_date: Date.now()
            }

            const dataUser = {
                status: data.status,
                first_name: user.first_name,
                email: user.email,
                subtype: data.transaction.subtype,
                tx_type: data.transaction.tx_type,
                reference: data.transaction.reference,
                amount: parseFloat(setting.value)* 25 / 100,
                currency_code: data.transaction.currency.code,
                available_balance: userBalance
            }

            const dataSponsor = {
                status: data.status,
                first_name: sponsor.first_name,
                email: sponsor.email,
                subtype: data.transaction.subtype,
                tx_type: data.transaction.tx_type,
                amount: parseFloat(setting.value)* 25 / 100,
                currency_code: data.transaction.currency.code,
                available_balance: sponsorBalance
            }
            await Commission.create(commissionData);
            return { success: true, message: "Account was successfully updated", data: {user: dataUser, sponsor: dataSponsor} };
    }else{
        let status = {status: data.status}
        await Transaction.update(status, { where: { id } });
    }

       
    } catch (error) {
        console.error(error || null);
        throw new Error('Could not process your request');
    }
}


module.exports = {
    create,
    index,
    buddy,
    update,
    count,
    totals,
    limits,
    approveDeposit,
}
