const accountService = require('../services/Account');
const activityService = require('../services/Activity');
const investmentService = require('../services/Investment');
const productService = require('../services/Product');
const settingService = require('../services/Setting');
const transactionService = require('../services/Transaction');
const userService = require('../services/User');
const { cancellationConfirmation } = require('../helpers/emailHandler');

function permakey(title) {
    return title.split(' ')
        .join('-')
        .trim()
        .toLowerCase();
}

const getTxid = (prefix, autoid) => {
    return prefix.toUpperCase() + autoid.toString();
};

async function createCategory(req, res) {
    try {
        const data = req.body;
        await productService.createCategory(data);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.add-category`,
            description: `${req.user.group_name} added a new product category (${data.title})`,
            subsection: 'Add Category',
            section: 'Products',
            ip: null,
            data,
        });
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function create(req, res) {
    try {
        const data = req.body;
        data.captured_by = req.user.id;
        data.permakey = permakey(data.title);
        // check product by unique permakey/code
        const product = await productService.findByPermakey(data.permakey);
        if (product && product.id) {
            return res.status(403).send({
                success: false,
                message: 'Validation error. Same product name already exists'
            });
        }

        await productService.create(data);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.add`,
            description: `${req.user.group_name} added a new product (${data.title})`,
            section: 'Products',
            subsection: 'Add',
            ip: null,
            data,
        });
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function index(req, res) {
    try {
        const products = await productService.index(req.query);
        const { count, rows } = products;
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
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function history(req, res) {
    try {
        const products = await productService.history(req.query);
        const { count, rows } = products[0];
        console.log(products[0])
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: products[0],
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}



async function cancellations(req, res) {
    try {
        const products = await productService.cancellations(req.query);
        const { count, rows } = products;

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
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function cancelStatus(req, res) {
    try {
        const data = req.body;
        await productService.cancelStatus(data.id, { status: data.status });
        return res.send({
            success: true,
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function getMembersByProductId(req, res) {
    try {
        const members = await productService.getMembersByProductId(req.params.id);
        console.log(members[0]);
        const { count, rows } = members[0];
        return res.send({
            success: true,
            data: {
                count,
                next: null,
                previous: null,
                results: members[0],
            }
        });
    } catch (error) {
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function show(req, res) {
    try {
        const product = await productService.show(req.params.id);
        console.log(product)
        return res.send({
            success: true,
            data: product
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function showCategory(req, res) {
    try {
        const category = await productService.showCategory(req.params.id);
        return res.send({
            success: true,
            data: category
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function update(req, res) {
    try {
        const data = req.body;
        await productService.update(req.params.id, data);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.update`,
            description: `${req.user.group_name} updated a product (${data.title})`,
            section: 'Products',
            subsection: 'Update',
            ip: null,
            data: {
                ...data,
                id: req.params.id,
            },
        });
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function updateCategory(req, res) {
    return productService.updateCategory(req.params.id, req.body)
        .then(data => res.send(data))
        .catch(err => {
            console.log(err.message)
            res.send({
                success: false,
                message: err.message,
            });
        });
}

async function destroy(req, res) {
    try {
        const data = await productService.show(req.params.id);
        await productService.destroy(req.params.id);
        await activityService.addActivity({
            user_id: req.user.id,
            action: `${req.user.group_name}.products.delete`,
            description: `${req.user.group_name} deleted a product (${data.title})`,
            section: 'Products',
            subsection: 'Delete',
            ip: null,
            data,
        });
        return res.send({
            success: true,
        });
    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function categories(req, res) {
    try {
        const categories = await productService.categories(req.query);
        const { count, rows } = categories;
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
        console.log(error.message)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function cancellationsAction(req, res) {
    try {
        const { type } = req.params;
        const {
            user_product_id,
            product_id,
            member_id,
            reason,
        } = req.body;

        // get user product
        const userProduct = await productService.showUserProduct(user_product_id);

        // retrieve settings config
        const settings = await settingService.findByKey('product_cancellation_penalty_fee');

        // retrieve product by id
        const product = await productService.show(product_id);
        const { title, product_code, product_subcategory, fees } = product;
        const { code, allow_cancellations } = product_subcategory;

        if (!allow_cancellations) {
            return res.status(403).send({
                success: false,
                message: 'Cancellations on this product not allowed'
            });
        }
        
        // apply cancellation penalties if any, and
        // top-up member wallet balance accordingly
        let isPercentage = false;
        let cancellationFees = 0;
        if (fees && fees.cancellation_penalty_fee) {
            cancellationFees = parseFloat(fees.cancellation_penalty_fee);
        } else if (settings & settings.value) {
            if (settings.value.includes('%')) {
                // this is a percentage value
                isPercentage = true;
            }
            cancellationFees = parseFloat(settings.value);
        }

        // update status
        const action = (type === 'approve') ? 'approved' : 'rejected';
        const status = (type === 'approve') ? 'Cancellation Complete' : 'Active';
        const cancellationStatus = (type === 'approve') ? 'Complete' : 'Rejected';
        const updated = await productService.cancelStatus(user_product_id, {
            status,
            reason,
            cancellation_status: cancellationStatus,
            cancellation_approved_by: req.user.id,
        });

        if (updated) {

            // retrieve member by id
            const member = await userService.show(member_id, false);

            if (type === 'approve') {

                let creditAmount = 0;
                switch (code) {
                    // calculate fixed plans cancellations
                    case 'FP':
                        // retrieve investment record
                        const investment = await investmentService.show({
                            user_product_id: userProduct.id,
                        });

                        if (investment.id) {
                            const { invested_amount } = investment;

                            // update investment record
                            await investmentService.update(investment.id, {
                                status: 'Cancelled',
                            });

                            // calculations (invested amount minus cancellation penalty fees)
                            const investedAmount = parseFloat(invested_amount);
                            const feeAmount = (isPercentage) ? (investedAmount * cancellationFees / 100) : cancellationFees;
                            creditAmount = investedAmount - feeAmount;
                        }
                        break;
                }

                if (creditAmount > 0) {
                    // retrieve member's wallet
                    const wallet = await accountService.wallet(member_id);
    
                    // log transaction
                    const currency = await currencyService.show(currency_code); // get currency
                    const transData = {
                        currency,
                        fee: null,
                        amount: creditAmount,
                        total_amount: creditAmount,
                        user_id: member.id,
                        tx_type: 'credit',
                        subtype: 'product',
                        status: 'Completed',
                        note: `${title}: ${status}`,
                        reference: `Cancelled-${product_code}`,
                        source_transaction: user_product_id,
                        metadata: fees,
                    };
                    const transaction = await transactionService.create(transData);
                    const txid = getTxid(product_code, transaction.auto_id);
                    await transactionService.update({ txid }, transaction.id);
                    transaction.txid = txid;
                    
                    // deduct funds from user wallet
                    await accountService.update({
                        balance: parseFloat(wallet.balance) + creditAmount,
                        available_balance: parseFloat(wallet.available_balance) + creditAmount,
                        updated: sequelize.fn('NOW'),
                    }, wallet.id);
                }
            }
            
            // log activity log
            await activityService.addActivity({
                user_id: req.user.id,
                action: `${req.user.group_name}.products.cancel.${action}`,
                description: `${req.user.first_name} updated product cancellation request (${status}: ${product.title})`,
                section: 'Products',
                subsection: 'Cancellation Requests',
                ip: null,
                data: {
                    ...req.body,
                    ...req.params,
                },
            });

            // send email to member
            await cancellationConfirmation({
                action,
                product,
                email: member.email,
                first_name: member.first_name,
            });

            return res.send({ success: true });
        }
        return res.send({ success: false });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process request'
        });
    }
}

module.exports = {
    createCategory,
    create,
    index,
    history,
    show,
    update,
    destroy,
    categories,
    getMembersByProductId,
    categories,
    updateCategory,
    showCategory,
    cancelStatus,
    cancellations,
    cancellationsAction,
};