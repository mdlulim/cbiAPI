const { Buddy } = require('../models/Buddy');
const { lookupAccount } = require('../services/BuddyAPI')

async function index() {
    try {
        const buddyAccount = await Buddy.findAll();
        return buddyAccount
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function store(data) {
    try {

        let status = await lookupAccount(data.buddy_identifier)

        if(status.data.data.active) {
            const buddyAccount = await Buddy.create(data);
            return buddyAccount
        }
        return {
            message: 'Buddy Acount not Registered'
        }
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function show(id) {
    try {
        const buddyAccount = await Buddy.findByPk(id);
        return buddyAccount
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function update(data) {
    try {
        const buddyAccount = await Buddy.update({
            buddy_identifier: data.buddy_identifier,
        }, {
            where: { id: data.id }
        });
        return buddyAccount
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

async function destroy(id) {
    try {
         const buddyAccount = await Buddy.destroy({
             where: {
                 id
             }
         });
        return buddyAccount
    } catch (error) {
        console.error(error.message || null);
        throw new Error('Could not process your request');
    }
}

module.exports = {
    store,
    index,
    show,
    update,
    destroy
}