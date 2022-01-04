const CompanyBankAccount = require('../services/CompanyBankAccount');
const CompanyCompanyvice = require('../services/Company');
const rn = require('random-number');
const moment = require('moment');
const authService = require('../services/Auth');
const otpService = require('../services/OTPAuth');
const emailHandler = require('../helpers/emailHandler');
const { sendOTPAuth } = require('../helpers/smsHandler');

async function create(req, res) {
    let data = req.body;
    try {
        return await CompanyBankAccount.create(data)
        .then(() => res.send({ success: true }))
        .catch(err => {
            res.send({
                success: false,
                message: err.message,
            });
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function index(req, res) {
    try {
        const banks = await CompanyBankAccount.index(req.query);
        const { count, rows } = banks;
        return res.send({
            success: true,
            data: {
                count,
                results: rows,
            }
        });
    } catch (error) {
        console.log(error);
        return res.send({
            success: false,
            message: 'Could not process request 02'
        });
    }
}

async function show(req, res) {
    try {
        const bankAccount = await CompanyBankAccount.show(req.params.id);
        return res.send({
            success: true,
            data: bankAccount
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
        await CompanyBankAccount.update(req.params.id, req.body);

        return res.send({
            success: true, message: 'Bank details was successfully updated'
        });
    } catch (error) {
        return {
            success: false,
            message: 'Could not process request'
        };
    }
}

async function destroy(req, res) {
    try {
        return CompanyBankAccount.destroy(req.params.id)
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

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
};