const transactionService    = require('../services/Transaction');
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
            description: `${user.first_name} made a ${data.subtype} of ${data.amount.toFixed(data.currency.divisibility)} ${data.currency.code}`,
            ip: null,
            data,
        });

        const txid = getTxid(data.subtype, transaction.auto_id);
        await transactionService.update({ txid }, transaction.id);
        transaction.txid = txid;

        // if it's a deposit
        // store POP (Proof of Payment)
        if (data.tx_type === 'credit' && data.subtype === 'deposit') {
            if (data.file) {
                // check there a document record already with the same txid
                const docs = await documentService.search('note', txid);
                if (docs && docs.length > 0) {
                    // update record
                    await documentService.update({
                        file: data.file.name,
                        metadata: JSON.stringify(data.file),
                        status: 'Pending',
                    }, docs[0].id);
                } else {
                    // insert new document record
                    const document = {
                        user_id: req.user.id,
                        file: data.file.name,
                        category: 'transactions',
                        type: 'deposit',
                        metadata: JSON.stringify(data.file),
                        status: 'Pending',
                        note: txid,
                    };
                    await documentService.create(document);
                }
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