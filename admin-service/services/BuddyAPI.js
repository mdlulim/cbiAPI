const config = require('../config');
const axios = require('axios');
const { Account } = require('../models/Account');

async function lookupBalance() {
    try {
        const response = await axios('https://staging.buddy.na/api/v2/services/cbi/lookup/balance', {
            headers:{
                'authenticationToken': config.buddy.authenticationToken
            }
        });
        return response.data;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function lookupAccount(data) {
    try {
        const response = await axios('https://staging.buddy.na/api/v2/services/cbi/lookup/account', {
            params: { data },
            headers:{
                'authenticationToken': config.buddy.authenticationToken
            }
        });
        return response.data;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function lookupTransaction(data) {
    try {
        let search = data.search
        let from = data.search
        let to = data.search
        let perPage = data.search
        let page = data.page

        const response = await axios('https://staging.buddy.na/api/v2/services/cbi/lookup/transactions', {
            params: { search, from, to, perPage, page },
            headers:{
                'authenticationToken': config.buddy.authenticationToken
            }
        });
        return response.data;
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function eventTransfer(data) {
    try {
        let reference = data.reference;
        let identifier = data.identifier;
        let amount = data.amount;
        let currency = data.currency;
        // let user_id = data.user_id;

        const getBalance = await Account.find({
            where: {
                user_id: 'bbf83e4d-b548-43e9-90bd-fd4cd0ccea6b'
            }
        });

        console.log(getBalance.available_balance);

        if(getBalance.available_balance >= amount) {
            newAmount = getBalance.available_balance - amount;
            await Account.update({
                available_balance: newAmount,
            }, {
                where: { user_id: 'bbf83e4d-b548-43e9-90bd-fd4cd0ccea6b' }
            });

            const response = await axios('https://staging.buddy.na/api/v2/services/cbi/event/transfer', {
                method: "POST",
                data: {
                    reference,
                    identifier,
                    amount,
                    currency,
                },
                headers: {
                    'authenticationToken': config.buddy.authenticationToken
                }
            });
        return response.data;
        } else {
            return {
                message: 'insufficient funds'
            }
        }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    lookupBalance,
    lookupAccount,
    lookupTransaction,
    eventTransfer
}