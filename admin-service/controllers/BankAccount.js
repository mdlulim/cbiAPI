const bankAccountService = require('../services/BankAccount');
const userService = require('../services/User');
const rn = require('random-number');
const moment = require('moment');
const authService = require('../services/Auth');
const otpService = require('../services/OTPAuth');
const emailHandler = require('../helpers/emailHandler');
const { sendOTPAuth } = require('../helpers/smsHandler');

async function create(req, res) {
    try {
        return bankAccountService.create(req.body)
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

async function verifyBankAccount(req, res) {
    try {
        const user = await userService.show(req.body.user_id);
        // generate otp code
        const code = rn({
            min: 100000,
            max: 999999,
            integer: true,
        });
      
        const bankdetais = `${req.body.user.first_name}.bankAccount.verify`;
        const authRecord = {
            user_id: req.body.user_id,
            device: {},
            geoinfo: {},
            type: 'OTP',
            description: `${req.body.user.first_name} verify bank account`,
            transaction: bankdetais ,
            expiry: moment().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
            token: '',
            bankdetais,
            code,
        };

        // delete previous otp login attemps/records
        // and insert a new record
        console.log('============================================ '+req.body.user_id+' ============================================');
        await authService.deleteOtp(req.body.user_id)
        await authService.createOtp(authRecord)
        return { success: true, message: 'OTP was successfully sent' }
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
        const currencies = await bankAccountService.index(req.query);
        const { count, rows } = currencies;
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
        console.log(error);
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function getBankAccountsPending(req, res) {
    console.log('=====================bankAccount=======================================')
    try {
        const bankAccount = await bankAccountService.getBankAccountsPending();
        console.log(bankAccount)
        return res.send({
            success: true,
            data: bankAccount
        });
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Could not process request -0'
        });
    }

}

async function show(req, res) {
    try {
        const bankAccount = await bankAccountService.show(req.params.id);
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
        return bankAccountService.update(req.params.id, req.body)
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

async function destroy(req, res) {
    try {
        return bankAccountService.destroy(req.params.id)
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


async function otp(req, res) {
    try {
        // get user
        //console.log(req.body.user.id)
        //return
        const user = await userService.show(req.body.user.id);

        // destroy all old OTP records
        await otpService.destroyAll({
            user_id: req.body.user.id,
        });

        // create/log OTP record
        const otpRecord = {
            ...req.body,
            user_id: req.body.user.id,
        };
        const otp = await otpService.create(otpRecord);
        // send OTP auth
        if (otp.data.code) {
            const mobile = req.body.user.mobile.replace('+', '');
            await sendOTPAuth(mobile, otp.data.code);
        }

        // response
        return res.send({ success: true });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process request. Authentication failed'
        });
    }
}

async function otpResend(req, res) {
    try {
        // get user
        const user = await userService.show(req.user.id);

        // destroy all old OTP records
        await otpService.destroyAll({
            user_id: user.id,
        });

        // create/log OTP record
        const otpRecord = {
            ...req.body,
            user_id: user.id,
        };
        const otp = await otpService.create(otpRecord);

        // send OTP auth
        if (otp.code) {
            const mobile = user.mobile.replace('+', '');
            await sendOTPAuth(mobile, otp.code);
        }

        // response
        return res.send({ success: true });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process request. Authentication failed'
        });
    }
}

async function otpVerify(req, res) {
    try {
        // get otp record
        const { code, transaction } = req.body;
        const otp = await otpService.show({
            code,
            transaction,
        });

        if (otp && otp.id) {
            // destroy all old OTP records
            await otpService.destroyAll({
                user_id: req.user.id,
            });
            return res.send({ success: true });
        }

        return res.send({ success: false });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({
            success: false,
            message: 'Could not process request. Authentication failed'
        });
    }
}

module.exports = {
    create,
    index,
    show,
    update,
    destroy,
    getBankAccountsPending,
    verifyBankAccount,
    otp,
    otpResend,
    otpVerify,
};