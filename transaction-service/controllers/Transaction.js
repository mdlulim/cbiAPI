const transactionService    = require('../services/Transaction');
const activityService = require('../services/Activity');
const currencyService = require('../services/Currency');
const documentService = require('../services/Document');
const userService = require('../services/User');
const emailHandler = require('../helpers/emailHandler');
const { decrypt } = require('../utils');

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
            switch (subtype) {
                case 'withdraw':
                    if (reference === 'BTC-Withdrawal') {
                        data.note = 'BTC Withdrawal Request';
                    }
                    if (reference === 'Bank-Withdrawal') {
                        data.note = 'Bank Account Withdrawal Request';
                    }
                    data.source_transaction = user.referral_id;
                    break;
            }
        }

        // insert transaction
        data.fee = parseFloat(decrypt(req.body.fee));
        data.amount = parseFloat(decrypt(req.body.amount));
        data.total_amount = parseFloat(decrypt(req.body.total_amount));
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

        // if it's a deposit
        // store POP (Proof of Payment)
        if (data.tx_type === 'credit' && data.subtype === 'deposit') {
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

        /**
         * Transfer logic here
         */
        if (data.tx_type === 'credit' && data.subtype === 'transfer') {

            // find recipient
            const recipient = await userService.findByReferralId(req.body.recipient);

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
            await emailHandler.depositRequestNotification({
                first_name: recipient.first_name,
                email: recipient.email,
                amount: data.amount.toFixed(data.currency.divisibility),
                currency_code: data.currency.code,
                sender: `${user.first_name} ${user.last_name} (${user.referral_id})`,
            });
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
        return transactionService.index()
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

module.exports = {
    create,
    index,
    count,
    totals,
};