const transactionService    = require('../services/Transaction');
const accountService = require('../services/Account');
const activityService = require('../services/Activity');
const currencyService = require('../services/Currency');
const documentService = require('../services/Document');
const userService = require('../services/User');
const emailHandler = require('../helpers/emailHandler');

const getSubsection = (data) => {
    const {
        tx_type,
        subtype,
    } = data;
    return `${tx_type[0].toUpperCase() + tx_type.substr(1)} ${subtype[0].toUpperCase() + subtype.substr(1)}`;
};

const getTxid = (subtype, autoid) => {
    return subtype.substr(0, 3).toUpperCase() + autoid.toString();
};

async function create(req, res) {
    try {
        const {
            currency_code,
            tx_type,
            subtype,
            reference,
        } = req.body;

        // get currency
        const currency = await currencyService.show(currency_code);
        const data = {
            ...req.body,
            user_id: req.user.id,
            currency,
        };

        // get user
        const user = await userService.show(req.user.id);

        if (tx_type === 'credit') {
            switch (subtype) {
                case 'deposit':
                    data.reference = 'Top-Up';
                    data.note = 'CBI Wallet Top-up Request';
                    data.destination_transaction = user.referral_id;
                    break;
            }
        }
        if (tx_type === 'debit') {
            data.source_transaction = user.referral_id;
            
            switch (subtype) {
                case 'withdraw':
                    if (reference === 'BTC-Withdrawal') {
                        data.note = 'BTC Withdrawal Request';
                    }
                    if (reference === 'Bank-Withdrawal') {
                        data.note = 'Bank Account Withdrawal Request';
                    }
                    break;

                case 'transfer':
                    data.note = 'CBI Transfer';
                    data.reference = 'Internal-Transfer';
                    data.status = 'Completed';
                    break;
            }
        }

        // insert transaction
        data.fee = parseFloat(req.body.fee);
        data.amount = parseFloat(req.body.amount);
        data.total_amount = parseFloat(req.body.total_amount);

        // insert transaction
        const transaction = await transactionService.create(data);

        if (!transaction) {
            return res.status(403).send({
                success: false,
                message: 'Could not process request'
            });
        }

        // log activity
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.transactions.${data.tx_type}.${data.subtype}`,
            section: 'Transactions',
            subsection: getSubsection(data),
            description: `${user.first_name} made a ${data.subtype} of ${data.amount.toFixed(data.currency.divisibility || 4)} ${data.currency.code || 'CBI'}`,
            ip: null,
            data,
        });

        const txid = getTxid(data.subtype, transaction.auto_id);
        await transactionService.update({ txid }, transaction.id);
        transaction.txid = txid;

        if (data.tx_type === 'credit') {
            // if deposit
            // store pop (proof of payment)
            if (data.subtype === 'deposit') {
                // update document/file record
                const document = await documentService.findByCategoryType('pop', 'deposit', req.user.id);
                if (document && document.id) {
                    await documentService.update(document.id, {
                        metadata: JSON.stringify({
                            txid,
                        })
                    });
                }
    
                // send email to member
                await emailHandler.depositRequestNotification({
                    first_name: user.first_name,
                    email: user.email,
                    reference: txid,
                    amount: data.amount.toFixed(data.currency.divisibility),
                    currency_code: data.currency.code,
                });
            }
        }

        if (data.tx_type === 'debit') {
            /**
             * transfer logic here
             */
            if (data.subtype === 'transfer') {

                // find recipient
                const recipient = await userService.findByReferralId(req.body.destination_transaction);
    
                const senderWallet = await accountService.wallet(user.id);
                const recipientWallet = await accountService.wallet(recipient.id);
    
                // update wallets (sender)
                const senderBalance = parseFloat(senderWallet.balance) - data.total_amount;
                const senderAvailableBalance = parseFloat(senderWallet.available_balance) - data.total_amount;
                await accountService.update({
                    balance: senderBalance,
                    available_balance: senderAvailableBalance,
                }, senderWallet.id);
    
                // update wallets (recipient)
                const recipientBalance = parseFloat(recipientWallet.balance) + data.amount;
                const recipientAvailableBalance = parseFloat(recipientWallet.available_balance) + data.amount;
                await accountService.update({
                    balance: recipientBalance,
                    available_balance: recipientAvailableBalance,
                }, recipientWallet.id);
    
                // send email to member
                await emailHandler.transferSendNotification({
                    first_name: user.first_name,
                    email: user.email,
                    reference: txid,
                    amount: data.amount.toFixed(data.currency.divisibility),
                    currency_code: data.currency.code,
                    recipient: `${recipient.first_name} ${recipient.last_name} (${recipient.referral_id})`,
                });
    
                // send email to recipient
                await emailHandler.transferReceiptNotification({
                    first_name: recipient.first_name,
                    email: recipient.email,
                    amount: data.amount.toFixed(data.currency.divisibility),
                    currency_code: data.currency.code,
                    sender: `${user.first_name} ${user.last_name} (${user.referral_id})`,
                });

                // insert recipient transaction
                const trans = await transactionService.create({
                    user_id: recipient.id,
                    tx_type: 'credit',
                    subtype: 'payment',
                    note: `Payment from ${user.first_name} ${user.last_name} (${user.referral_id})`,
                    reference: 'Internal-Payment',
                    balance: recipientAvailableBalance,
                    fee: 0,
                    amount: data.amount,
                    total_amount: data.amount,
                    currency: data.currency,
                    source_transaction: user.referral_id,
                    destination_transaction: recipient.referral_id,
                    status: 'Completed',
                });

                // update txid
                const rtxid = getTxid('payment', trans.auto_id);
                await transactionService.update({ txid: rtxid }, trans.id);
            }
        }

        return res.status(200).send({
            success: true,
            data: transaction,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function index(req, res){
    try {
        return transactionService.index(req.user.id, req.query)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
};

async function buddy(req, res){
    try {
        return transactionService.buddy(req.user.id, req.query)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
};

async function count(req, res){
    try {
        const { tx_type, subtype } = req.params;
        return transactionService.count(req.user.id, tx_type, subtype)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
};

async function totals(req, res){
    try {
        const { tx_type, subtype } = req.params;
        return transactionService.totals(req.user.id, tx_type, subtype)
        .then(data => res.send(data));
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
};

async function limits(req, res){
    try {
        const { kyc_level } = req.params;
        const limits = await transactionService.limits(kyc_level);
        return res.send({
            success: true,
            data: limits,
        });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
};

module.exports = {
    create,
    index,
    buddy,
    count,
    totals,
    limits,
};
