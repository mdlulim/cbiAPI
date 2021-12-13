const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const emailHandler = require('../helpers/emailHandler');

const activityService = require('../services/Activity');
const groupService = require('../services/Group');
const userService = require('../services/User');

function cleanEmail(email) {
    return email ? email.trim() : email;
}

const getSubsection = (data) => {
    const {
        tx_type,
        subtype,
    } = data;
    return `${tx_type[0].toUpperCase() + tx_type.substr(1)} ${subtype[0].toUpperCase() + subtype.substr(1)}`;
};

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
        await userService.update(req.params.id, {archive:true,status:"Archived"})
        .then((data) => {
            console.log(data)
            if(data.success){
                const user = data.user;
                // send email to recipient
                 emailHandler.updatingUserStatus({
                    first_name: user.first_name,
                    email: user.email,
                    status: user.status,
                    sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                });
            }
           return res.send({ success: data.success, message: data.message})
        })
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
        await userService.block(req.params.id)
        .then((data) => {
            console.log(data)
            if(data.success){
                const user = data.user;
                // send email to recipient
                 emailHandler.updatingUserStatus({
                    first_name: user.first_name,
                    email: user.email,
                    status: user.status,
                    sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                });
            }
           return res.send({ success: data.success, message: data.message})
        })
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
        await userService.unarchive(req.params.id)
        .then((data) => {
            console.log(data)
            if(data.success){
                const user = data.user;
                // send email to recipient
                 emailHandler.updatingUserStatus({
                    first_name: user.first_name,
                    email: user.email,
                    status: user.status,
                    sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                });
            }
           return res.send({ success: data.success, message: data.message})
        })
        .catch(err => { 
            res.send({ success: false,message: err.message,  });
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
        await userService.unblock(req.params.id)
        .then((data) => {
            if(data.success){
                const user = data.user;
                // send email to recipient
                 emailHandler.updatingUserStatus({
                    first_name: user.first_name,
                    email: user.email,
                    status: user.status,
                    sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                });
            }
           return res.send({ success: data.success, message: data.message})
        })
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
        const data = req.body.transaction;
        // console.log(req.user);
        return userService.updateTransaction(req.params.id, req.body).then(async (data) => {
           // console.log(data)
            if(data.success){
                console.log(data)
                // send email to recipient
                await emailHandler.transactionNotification({
                    first_name  : data.data.first_name,
                    email       : data.data.email,
                    status      : data.data.status,
                    amount      : data.data.amount,
                    reference   : data.data.reference,
                    available_balance   : data.data.available_balance,
                    currency_code       : data.data.currency_code,
                    sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                }).then((response) =>{
                    console.log(response)
                });

               await activityService.addActivity({
                    user_id: req.user.id,
                    action: `${req.user.group_name}.transactions.${data.data.tx_type}.${data.data.subtype}`,
                    section: 'Transactions',
                    subsection: getSubsection(data.data),
                    description: `${data.data.first_name} ${data.data.status}  a ${data.data.subtype} of ${data.data.amount} ${data.data.currency_code}`,
                    ip: null,
                    data,
                })
            }
           return res.send({ success: data.success, message: data.message})
        })
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

async function email(req, res){
    try {
        return userService.email(req.params.email)
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
        return userService.updateBankAccounts(req.params.id, req.body)
        .then(data => res.send({ success: true }));
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

// async function creditUserWallet(req, res){
//     try {
//         return userService.creditWallet(req.params.id, req.body)
//         .then(data => {
//             console.log(data)
//             res.send({ success: true, message: 'Account was successfully updated' }) 
//         });
//     } catch (err) {
//         return res.status(500).send({
//             success: false,
//             message: 'Could not process your request'
//         });
//     }
// }

// async function debitUserWallet(req, res){
//     try {
//         return userService.debitWallet(req.params.id, req.body)
//         .then(data => res.send({ success: true, message: 'Account was successfully updated' }));
//     } catch (err) {
//         return res.status(500).send({
//             success: false,
//             message: 'Could not process your request'
//         });
//     }
// }

async function approveDeposit(req, res){
    try {
        return userService.approveDeposit(req.params.id, req.body).then(async (data) => {
            console.log(data)
            if(data.success){
               console.log(data)
                //send email to recipient
                await emailHandler.approveMembership({
                    first_name  : data.data.user.first_name,
                    email       : data.data.user.email,
                    status      : data.data.user.status,
                    amount      : data.data.user.amount,
                    reference   : data.data.user.reference,
                    available_balance   : data.data.user.available_balance,
                    currency_code       : data.data.user.currency_code,
                    sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                })
                await emailHandler.memberCommissionFee({
                    first_name  : data.data.sponsor.first_name,
                    email       : data.data.sponsor.email,
                    status      : data.data.sponsor.status,
                    amount      : data.data.sponsor.amount,
                    reference   : data.data.user.first_name,
                    available_balance   : data.data.sponsor.available_balance,
                    currency_code       : data.data.sponsor.currency_code,
                    sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                })
                
               await activityService.addActivity({
                    user_id: req.user.id,
                    action: `${req.user.group_name}.transactions.${data.data.user.tx_type}.${data.data.user.subtype}`,
                    section: 'Transactions',
                    subsection: getSubsection(data.data.user),
                    description: `${data.data.user.first_name} ${data.data.user.status}  a ${data.data.user.subtype} of ${data.data.user.amount} ${data.data.user.currency_code}`,
                    ip: null,
                    data,
                })
            }
           return res.send({ success: data.success, message: data.message})
        });
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
    updateBankAccounts,
    approveDeposit,
    email,
}
