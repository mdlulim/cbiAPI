const CoinPayments =  require('coinpayments');
const emailHandler = require('../helpers/emailHandler');
const eventStoreService = require('../services/EventStore');
const transactionService = require('../services/Transaction');
const userService = require('../services/User');
const config = require('../config');

async function ipn(req, res) {
    console.log("Data from IPN received, ", req.body)
    const data = req.body;

    //convert ZAR to CBI
    //data.fiat_amount

    console.log("Data from IPN received, ", req.body)
    return res.send({res: "got data from you"})
    // return transactionService.approveDeposit(data)
    // .then(data => {console.log('################# Got data from IPN');return res.send(data)})
    //     .catch(err => {
    //         return res.status(500).send({
    //             success: false,
    //             message: 'Could not process your request'
    //         });
    //     })
};

async function create(req, res) {
    try {
        const { subtype } = req.body;
        switch (subtype) {
            case 'deposit':  return deposit(req, res);
            case 'withdraw': return withdraw(req, res);
            default: 
                return res.status(403).send({
                    success: false,
                    message: 'Bad request'
                }); 
        }
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
};

async function deposit(req, res) {
    try {
        // retrieve user details
        const user = await userService.show(req.user.id);
        const {
            amount,
            currency,
            transaction,
        } = req.body;
        const createTransaction = {
            amount,
            currency1: currency,
            currency2: currency,
            buyer_email: user.email,
            cmd: 'create_transaction',
            item_name: 'crypto_deposit',
            item_number: transaction.txid,
            ipn_url: `${config.baseurl.api}transactions/coinpayments/ipn`,
        };
        const client = new CoinPayments(config.coinPayments);
        return client.createTransaction(createTransaction)
            .then(async data => {
                const { address } = data;

                // store third-party event log
                await eventStoreService.create({
                    action: 'transaction.create.deposit',
                    provider: 'coinpayments',
                    description: 'Create Coin Payments Deposit Transaction',
                    request: createTransaction,
                    response: data,
                    status: 'SUBMITTED TO COINPAYMENTS',
                    ref: 'transactions',
                    ref_id: transaction.id,
                });

                // update transaction record
                await transactionService.update({
                    metadata: {
                        type: 'crypto',
                        currency,
                        data,
                    }
                }, transaction.id);

                // send email
                await emailHandler.cryptoDepositRequestNotification({
                    email: user.email,
                    first_name: user.first_name,
                    reference: transaction.txid,
                    base_amount: amount.toFixed(8),
                    base_currency: currency,
                    quote_amount: transaction.amount,
                    quote_currency: transaction.currency.code,
                    address,
                });

                return res.send({
                    success: true,
                    data: {
                        address
                    },
                });
            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).send({
                    success: false,
                    message: 'Could not process your request'
                });
            });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function withdraw(req, res) {
    try {
        const {
            amount,
            currency,
            transaction,
            address,
        } = req.body;
        const createWithdrawal = {
            amount,
            address,
            auto_confirm: 1,
            currency1: currency,
            currency2: currency,
            note: transaction.txid,
            cmd: 'create_withdrawal',
            ipn_url: `${config.baseurl.api}transactions/coinpayments/ipn`,
        };
        const client = new CoinPayments(config.coinPayments);
        return client.createWithdrawal(createWithdrawal)
            .then(async data => {

                // store third-party event log
                await eventStoreService.create({
                    action: 'transaction.create.withdrawal',
                    provider: 'coinpayments',
                    description: 'Create Coin Payments Withdrawal Transaction',
                    request: createWithdrawal,
                    response: data,
                    status: 'SUBMITTED TO COINPAYMENTS',
                    ref: 'transactions',
                    ref_id: transaction.id,
                });

                // update transaction record
                await transactionService.update({
                    metadata: {
                        type: 'crypto',
                        currency,
                        data,
                    }
                }, transaction.id);

                return res.send({
                    success: true,
                });
            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).send({
                    success: false,
                    message: 'Could not process your request'
                });
            });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function convert(req, res) {
    try {
        const client = new CoinPayments(config.coinPayments);
        const options = req.body;
        return client.convertCoins(options)
            .then(async data => {
                return res.send({
                    success: true,
                    data,
                });
            })
            .catch(err => {
                console.log(err.message)
                return res.status(500).send({
                    success: false,
                    message: 'Could not process your request'
                });
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
    ipn,
    create,
    convert,
};
