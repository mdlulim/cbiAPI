const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const emailHandler = require('../helpers/emailHandler');

const activityService = require('../services/Activity');
const groupService = require('../services/Group');
const userService = require('../services/User');

function cleanEmail(email) {
    return email ? email.trim() : email;
}

async function create(req, res) {
    try {
        const {
            first_name,
            last_name,
            group_id,
            username,
        } = req.body;

        const email = cleanEmail(req.body.email || null);

        /**
         * Validations
         */

        // validate email
        if (!email) {
            return res.status(403).send({
                success: false,
                message: 'Validation error. Email address is required.'
            });
        }
        
        // validate first name
        if (!first_name) {
            return res.status(403).send({
                success: false,
                message: 'Validation error. First name is required.'
            });
        }
        
        // validate last name
        if (!last_name) {
            return res.status(403).send({
                success: false,
                message: 'Validation error. Last name is required.'
            });
        }
        
        // validate last name
        if (!group_id) {
            return res.status(403).send({
                success: false,
                message: 'Validation error. User role is required.'
            });
        }

        // check if the email address already exists
        const emailCheck = await userService.findByPropertyValue('email', email);
        if (emailCheck && emailCheck.id) {
            return res.status(403).send({
                success: false,
                message: 'Validation error. Email address already exists.'
            });
        }

        if (username) {
            // check if the username already exists
            const usernameCheck = await userService.findByPropertyValue('username', username);
            if (usernameCheck && usernameCheck.id) {
                return res.status(403).send({
                    success: false,
                    message: 'Validation error. Username already exists.'
                });
            }
        }

        // generate password
        const string   = generator.generate({ length: 4 });
        const numbers  = generator.generate({ length: 4, numbers: true });
        const password = string.toLowerCase() + numbers.toString();
        const salt     = bcrypt.genSaltSync();
        const securePassword = bcrypt.hashSync(password, salt);

        // create user record
        const data = {
            ...req.body,
            username: username || email,
            password: securePassword,
            email,
            salt,
        };
        await userService.create(data);

        // log activity
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.users.add`,
            description: `${req.user.first_name} added a new user (${data.first_name})`,
            section: 'Admin Users',
            subsection: 'Add',
            ip: null,
            data,
        });

        if (data.status && data.status === 'Active') {
            // send email
            await emailHandler.newUser({
                password,
                username,
                first_name,
                email,
            });
        }

        // response
        return res.status(200).send({ success: true });

    } catch (err) {
        console.log(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            console.log(err.errors[0].ValidationErrorItem);
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

async function index(req, res) {
    try {
        return userService.index(req.query)
        .then(data => res.send(data))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
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
        return userService.show(req.params.id)
        .then(data => res.send(data))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function update(req, res) {
    try {
        return userService.update(req.params.id, req.body)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function archive(req, res) {
    try {
        return userService.update(req.params.id, {archive:true,status:"Archived"})
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function block(req, res) {
    try {
        return userService.block(req.params.id)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function unarchive(req, res) {
    try {
        return userService.unarchive(req.params.id)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function unblock(req, res) {
    try {
        return userService.unblock(req.params.id)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function products(req, res) {
    try {
        return userService.products(req.params.id)
        .then(data => res.send(data))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function referrals(req, res) {
    try {
        const referrals = await userService.referrals(req.params.id);
        const { count, rows } = referrals;
        return res.send({
            success: true,
            data: {
                count,
                results: rows,
            },
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function transactions(req, res){
    try {
        return userService.transactions(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function updateTransaction(req, res){
    try {
        return userService.updateTransaction(req.params.id, req.body)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function addresses(req, res){
    try {
        return userService.addresses(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function emails(req, res){
    try {
        return userService.emails(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function mobiles(req, res){
    try {
        return userService.mobiles(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function bankAccounts(req, res){
    try {
        return userService.bankAccounts(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}


async function updateBankAccounts(req, res){
    try {
        const updated = userService.updateBankAccounts(req.params.id, req.body)
        return { success: true,  updated };
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function cryptoAccounts(req, res){
    try {
        return userService.cryptoAccounts(req.params.id)
        .then(data => res.send(data));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

module.exports = {
    create,
    index,
    show,
    update,
    archive,
    block,
    unarchive,
    unblock,
    products,
    referrals,
    transactions,
    updateTransaction,
    addresses,
    emails,
    mobiles,
    bankAccounts,
    cryptoAccounts,
    updateBankAccounts
}
