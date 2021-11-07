const axios = require('axios');

async function lookupBalance() {
    try {
        const response = await axios('https://staging.buddy.na/api/v2/services/cbi/lookup/balance', {
            headers:{
                'authenticationToken': 'NmIwNWUwNmEtY2RjYi00MWRkLThlMDEtOGRjZjU1MWU3MjZk'
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
                'authenticationToken': 'NmIwNWUwNmEtY2RjYi00MWRkLThlMDEtOGRjZjU1MWU3MjZk'
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
                'authenticationToken': 'NmIwNWUwNmEtY2RjYi00MWRkLThlMDEtOGRjZjU1MWU3MjZk'
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
        const response = await axios('https://staging.buddy.na/api/v2/services/cbi/event/transfer', {
            method: "POST",
            data: {
                reference,
                identifier,
                amount,
                currency,
            },
            headers: {
                'authenticationToken': 'NmIwNWUwNmEtY2RjYi00MWRkLThlMDEtOGRjZjU1MWU3MjZk'
            }
        });
        return response.data
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