const transactionService = require('../services/Transaction');
const activityService = require('../services/Activity');
const currencyService = require('../services/Currency');
const userService = require('../services/User');
const emailHandler = require('../helpers/emailHandler');
const { decrypt } = require('../utils');
var Readable = require('stream').Readable

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

async function debitCreditUserAccount(req, res) {
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
            user_id: req.params.id,
            currency,
        };

        // get user
        const user = await userService.show(req.params.id);

        if (tx_type === 'credit') {
            switch (subtype) {
                case 'deposit':
                    data.reference = 'Top-Up';
                    data.note = 'CBI Wallet Top-up from main account';
                    data.destination_transaction = user.referral_id;
                    break;
            }
        }
        if (tx_type === 'debit') {
            switch (subtype) {
                case 'debit':
                    if (reference === 'CBI-Debit') {
                        data.note = 'CBI Debit from user account to main account';
                    }
                    if (reference === 'CBI-Debit') {
                        data.note = 'CBI Debit from user account to main account';
                    }
                    data.source_transaction = user.referral_id;
                    break;
            }
        }

        // insert transaction
        data.fee = parseFloat(req.body.fee);
        data.amount = parseFloat(req.body.amount);
        data.total_amount = parseFloat(req.body.total_amount);

        const transaction = await transactionService.create(data);

        if (!transaction) {
            return res.status(403).send({
                success: false,
                message: 'Could not process request transaction'
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

        const txid = getTxid(data.subtype, transaction.dataValues.auto_id);
        let transData = { txid: txid, status: 'Completed' }
        await transactionService.update(transData, transaction.id);
        transaction.txid = txid;

        // if it's a deposit
        // store POP (Proof of Payment)
        if (data.tx_type === 'credit' && data.subtype === 'deposit') {
            const credited = transactionService.creditWallet(req.params.id, req.body)

            // send email to member
            // await emailHandler.depositRequestNotification({
            //     first_name: user.first_name,
            //     email: user.email,
            //     reference: txid,
            //     amount: data.amount.toFixed(data.currency.divisibility),
            //     currency_code: data.currency.code,
            // });
            return res.status(200).send({
                success: true,
                data: credited,
            });
        }else{
            const debit = transactionService.debitWallet(req.params.id, req.body)
            // send email to member
           //await emailHandler.depositRequestNotification({
            //     first_name: user.first_name,
            //     email: user.email,
            //     reference: txid,
            //     amount: data.amount.toFixed(data.currency.divisibility),
            //     currency_code: data.currency.code,
            // });
            return res.status(200).send({
                success: true,
                data: debit,
            });
        }

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function index(req, res) {
    try {
        const transactions = await transactionService.index(req.query);
        const { count, rows } = transactions;
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: rows,
            }
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function show(req, res) {
    try {
        const transaction = await transactionService.show(req.params.id);
        return res.send({
            success: true,
            data: transaction
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}


async function getProofOfPayment(req, res) {
    try {
        const files = await transactionService.getProofOfPayment(req.params.id);
        return res.send({
            success: true,
            data: files
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function allTransactions(req, res){
    try {
        return transactionService.allTransactions()
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
};

async function batchProcessTransaction(req, res) {
    try {
        //get the file from S3 bucket
        const file = await axios({
            mode: 'no-cors',
            method: 'GET',
            url: req.body.url,
            crossdomain: true,
        })

        var s = new Readable()
        s.push(file.data)
        s.push(null)

        /**
        *convert the file to json object
        */
        s.pipe(csv()).on('data', (data) => results.push(data)).on('end', () => {
           // console.log(results);
        });

       // console.log(results, "+++++++++++++++++++")


        //update transactions on db
        // await userService.process(data);

        /**
         * send email notification status
         */


        /**
         * return result to caller
         */
        // return res.status(200).send({ success: true });
        return res.send({ file: "9usdf" })

    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
           // console.log(err.errors[0].ValidationErrorItem);
            return res.status(403).send({
                success: false,
                message: `Validation error.`
            });
        }
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function transactions(req, res){
    try {
        const transactions = await transactionService.transactions(req.query, req.body);
        const { count, rows } = transactions;
        return res.send({
            success: true,
            data: {
                count,
                results: rows,
            }
        });

    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
};

async function transactionstotal(req, res){
    try {
        const response = await transactionService.transactionstotal(req.body)
        return res.send({
            success: true,
            data: response.data
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
};


module.exports = {
    index,
    debitCreditUserAccount,
    show,
    allTransactions,
    getProofOfPayment,
    batchProcessTransaction,
    transactions,
    transactionstotal

};