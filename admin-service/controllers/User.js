const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
const emailHandler = require('../helpers/emailHandler');
const activityService = require('../services/Activity');
const groupService = require('../services/Group');
const userService = require('../services/User');
const transactionService = require('../services/Transaction');

function cleanEmail(email) {
    return email ? email.trim() : email;
}


const getTxid = (subtype, autoid) => {
    return subtype.substr(0, 3).toUpperCase() + autoid.toString();
};

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
            return res.send({
                success: false,
                message: 'Validation error. Email address is required.'
            });
        }
        // validate first name
        if (!first_name) {
            return res.send({
                success: false,
                message: 'Validation error. First name is required.'
            });
        }
        // validate last name
        if (!last_name) {
            return res.send({
                success: false,
                message: 'Validation error. Last name is required.'
            });
        }

        // validate last name
        if (!group_id) {
            return res.send({
                success: false,
                message: 'Validation error. User role is required.'
            });
        }

        // check if the email address already exists
        const emailCheck = await userService.findByPropertyValue('email', email);
        if (emailCheck && emailCheck.id) {
            return res.send({
                success: false,
                message: 'Validation error. Email address already exists.'
            });
        }

        if (username) {
            // check if the username already exists
            const usernameCheck = await userService.findByPropertyValue('username', username);
            if (usernameCheck && usernameCheck.id) {
                return res.send({
                    success: false,
                    message: 'Validation error. Username already exists.'
                });
            }
        }

        // generate password
        const string = generator.generate({ length: 4 });
        const numbers = generator.generate({ length: 4, numbers: true });
        const password = string.toLowerCase() + numbers.toString();
        const salt = bcrypt.genSaltSync();
        const securePassword = bcrypt.hashSync(password, salt);
        const verified = true;
        // create user record
        const data = {
            ...req.body,
            username: username || email,
            password: securePassword,
            email,
            salt,
            verified
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
        return res.send({ success: true, message: 'User was successfully created'});

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
            .then(async () => {
                // log activity
                await activityService.addActivity({
                    user_id: req.user.id,
                    action: `${req.user.group_name}.users.update`,
                    section: 'Users',
                    subsection: 'Update',
                    description: `${req.user.first_name} updated admin user record`,
                    ip: null,
                    data: req.body,
                });
                return res.send({ success: true })
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

async function archive(req, res) {
    try {
        await userService.update(req.params.id, { archive: true, status: "Archived" })
            .then((data) => {
                console.log(data)
                if (data.success) {
                    const user = data.user;
                    // send email to recipient
                    emailHandler.updatingUserStatus({
                        first_name: user.first_name,
                        email: user.email,
                        status: user.status,
                        sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                    });
                }
                return res.send({ success: data.success, message: data.message })
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
                if (data.success) {
                    const user = data.user;
                    // send email to recipient
                    emailHandler.updatingUserStatus({
                        first_name: user.first_name,
                        email: user.email,
                        status: user.status,
                        sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                    });
                }
                return res.send({ success: data.success, message: data.message })
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
                if (data.success) {
                    const user = data.user;
                    // send email to recipient
                    emailHandler.updatingUserStatus({
                        first_name: user.first_name,
                        email: user.email,
                        status: user.status,
                        sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                    });
                }
                return res.send({ success: data.success, message: data.message })
            })
            .catch(err => {
                res.send({ success: false, message: err.message, });
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
                if (data.success) {
                    const user = data.user;
                    // send email to recipient
                    emailHandler.updatingUserStatus({
                        first_name: user.first_name,
                        email: user.email,
                        status: user.status,
                        sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                    });
                }
                return res.send({ success: data.success, message: data.message })
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

async function transactions(req, res) {
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

async function updateTransaction(req, res) {
    try {
        const transact = req.body.transaction;
        const admin_user_id = req.user.id;

        if(req.body.transaction.status === 'Completed' || req.body.transaction.status === 'Rejected'){
            return res.send({ success: false, message: 'This transaction has already been processed!' })
        }

        return userService.updateTransaction(req.params.id, req.body, admin_user_id).then(async (data) => {
            let subtype = transact.subtype;

            if (transact.subtype.toLowerCase() === "deposit") {
                subtype = 'credited';
            } else {
                subtype = 'debited';
            }

            if (data.success) {
                // send email to recipient
                await emailHandler.transactionNotification({
                    first_name: data.data.first_name,
                    email: data.data.email,
                    status: data.data.status,
                    amount: data.data.amount,
                    subtype: subtype,
                    reference: data.data.reference,
                    currency_code: data.data.currency_code,
                    sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                }).then((response) => {
                    console.log('')
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
            return res.send({ success: data.success, message: data.message })
        })
    } catch (err) {
        return res.send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function addresses(req, res) {
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

async function emails(req, res) {
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

async function email(req, res) {
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

async function mobiles(req, res) {
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

async function bankAccounts(req, res) {
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


async function updateBankAccounts(req, res) {
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

async function approveDeposit(req, res) {
    try {
        const admin_user_id = req.user.id;
        if(req.body.transaction.status === 'Completed' || req.body.transaction.status === 'Rejected'){
            return res.send({ success: false, message: 'This transaction has already been proccessed!' })
        }
        return userService.approveDeposit(req.params.id, req.body, admin_user_id).then(async (data) => {
            if(data.success){
                const transaction = await transactionService.create(data.data.commission);
                const transactionToMain = await transactionService.create(data.data.main);

                if (!transaction) {
                    return res.status(403).send({
                        success: false,
                        message: 'Could not process request transaction'
                    });
                }

                // log activity
                await activityService.addActivity({
                    user_id: req.body.transaction.user_id,
                    action: `${req.user.group_name}.transactions.${req.body.transaction.tx_type}.${req.body.transactionsubtype}`,
                    section: 'Transactions',
                    subsection: getSubsection(req.body.transaction),
                    description: `${req.user.first_name} approved a ${req.body.transaction.subtype} of ${req.body.transaction.amount} ${req.body.transaction.currency.code}`,
                    ip: null,
                    data,
                });

                const txid = getTxid(transaction.subtype, transaction.dataValues.auto_id);
                const txidMain = getTxid(transactionToMain.subtype, transactionToMain.dataValues.auto_id);
                let transData = { txid: txid, status: 'Completed' }
                let transDataMain = { txid: txidMain, status: 'Completed' }

                await transactionService.update(transData, transaction.id);
                await transactionService.update(transDataMain, transactionToMain.id);

                transaction.txid = txid;
                //send email to recipient
                await emailHandler.approveMembership({
                    first_name: data.data.user.first_name,
                    email: data.data.user.email,
                    status: data.data.user.status,
                    amount: data.data.user.amount,
                    reference: data.data.user.reference,
                    currency_code: data.data.user.currency_code,
                    sender: `${req.user.first_name} ${req.user.last_name} (${req.user.referral_id})`,
                })

                await emailHandler.memberCommissionFee({
                    first_name: data.data.sponsor.first_name,
                    email: data.data.sponsor.email,
                    status: data.data.sponsor.status,
                    amount: data.data.sponsor.amount,
                    reference: data.data.user.first_name,
                    currency_code: data.data.sponsor.currency_code,
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
                
                return res.send({ success: data.success, message: data.message})
            }else{
                return res.send({ success: data.success, message: data.message})
            }
           
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Could not process your request'
        });
    }
}

async function cryptoAccounts(req, res) {
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

/**
 * Reset Password
 * 
 * Send a password reset email.
 */
async function passwordReset(req, res) {
    try {
        const { email } = req.body;

        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(405).send({
                success: false,
                message: 'Email address not registered.'
            });
        }

        const code = generator.generate({ length: 4, numbers: true });
        const token = jwt.sign({
            code,
            email,
        }, config.jwtSecret);

        const verification = {
            ...user.verification,
            token,
        };

        await User.resetPassword(user.id, {
            verification,
            // verify_token: token,
            updated: sequelize.fn('NOW'),
        });

        // send reset password email
        const { first_name } = user;
        await emailHandler.resetPassword({
            first_name,
            email,
            token,
        });

        return res.send({
            success: true,
            message: 'Password was successfully sent to '+first_name
        });
    } catch (error) {
        console.log('error', error.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
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
    passwordReset,
}
