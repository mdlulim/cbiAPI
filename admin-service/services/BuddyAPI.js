const config = require('../config');
const axios = require('axios');
const { Account } = require('../models/Account');
const { Buddy } = require('../models/Buddy');
const { customAlphabet } = require('nanoid');
const buddyTransaction = require('../models/BuddyTransction');

async function lookupBalance() {
    try {
        const response = await axios(config.buddy.base_url.staging + '/cbi/lookup/balance', {
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
        const response = await axios(config.buddy.base_url.staging +'/cbi/lookup/account', {
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

        const response = await axios(config.buddy.base_url.staging + '/cbi/lookup/transactions', {
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
        const nanoid = customAlphabet('1234567890abcdef', 10);

        let reference = 'BUUDY-TRANSFER-' + await nanoid();
        let identifier = await Buddy.find({
            where: {
                user_id: data.user_id
            }
        });
        let amount = data.amount;
        let currency = 'NAD';

        const getBalance = await Account.find({
            where: {
                user_id
            }
        });

        if(getBalance.available_balance >= amount) {
            newAmount = getBalance.available_balance - amount;
            await Account.update({
                available_balance: newAmount,
            }, {
                where: { user_id }
            });
    
        } else {
            return {
                message: 'insufficient funds'
            }
        }

        const response = await axios(config.buddy.base_url.staging + '/cbi/event/transfer', {
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

        try {
            const data = await buddyTransaction.create({
                user_id: data.user_id,
                note: response.data.data.data.message,
                reference,
                amount,
                currency
            })
        } catch (error) {
            console.error(error.message || null);
            throw new Error('Could not process your request');
        }

        
        return response.data;

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