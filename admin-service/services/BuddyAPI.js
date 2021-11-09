const config = require('../config');
const axios = require('axios');
const { Account } = require('../models/Account');
const { Buddy } = require('../models/Buddy');
const { customAlphabet } = require('nanoid');
const { buddyTransaction } = require('../models/BuddyTransction');

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

        let amount = data.amount;
        let currency = 'NAD';
        let reference = 'BUDDY-TRANSFER-' + await nanoid();
        let identifier = await Buddy.findOne({
            where: {
                user_id: data.user_id
            }
        });

        if (!identifier.buddy_identifier) {
            return {
                message: 'CBI member does not have Buddy Account.'
            }
        }
        

        const getBalance = await Account.findOne({
            where: {
                user_id: data.user_id
            }
        });



        const response = await axios(config.buddy.base_url.staging +'/cbi/event/transfer', {
            method: "POST",
            data: {
                reference,
                identifier: identifier.buddy_identifier,
                amount,
                currency,
            },
            headers: {
                'authenticationToken': config.buddy.authenticationToken
            }
        });

        try {
            await buddyTransaction.create({
                user_id: data.user_id,
                note: response.data.data.data.message,
                reference,
                amount,
                currency
            })
        } catch (error) {
            console.error(error.message || null);
            throw new Error('Could not reach BuddyAPI endpoint');

        }

        if(getBalance.available_balance >= amount) {
            if (response.data) {
                if(response.data.data.data.status == 'APPROVED') {
                    let newAvaliable = getBalance.available_balance - amount;
                    let newBalance = getBalance.balance - amount;
                    await Account.update({
                        balance: newBalance,
                        available_balance: newAvaliable
                    }, {
                        where: { user_id: data.user_id }
                    });
                    await buddyTransaction.update({
                        status: 'COMPLETED'
                    }, {
                        where: { user_id: data.user_id }
                    });
                } else {
                    await buddyTransaction.update({
                        status: 'PENDING'
                    }, {
                        where: { reference }
                    });
                }
            } else {
                return {
                    message: 'BuddyAPI unreachable'
                }
            }            
        } else {
            return {
                message: 'insufficient funds'
            }
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