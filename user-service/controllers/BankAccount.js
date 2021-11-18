const bankAccountService = require('../services/BankAccount');
const activityService = require('../services/Activity');
const otpService = require('../services/OTP');
const userService = require('../services/User');
const { sendOTPAuth } = require('../helpers/smsHandler');

async function create(req, res) {
    try {
        const data = req.body;
        data.user_id = req.user.id;

        // fetch user details
        const user = await userService.show(req.user.id);

        if (data.authenticate) {

            // create/log OTP record
            const otpRecord = {
                user_id: req.user.id,
                device: data.device || {},
                geoinfo: data.geoinfo || {},
                description: 'Add new bank account',
                transaction: `${req.user.group_name.toLowerCase()}.bank-account.add`,
                data: req.body,
            };
            const otp = await otpService.create(otpRecord);

            // send OTP auth
            if (otp.code) {
                const mobile = user.mobile.replace('+', '');
                await sendOTPAuth(mobile, otp.code);
            }

            // response
            return res.send({ success: true });
        }

        // create
        await bankAccountService.create(data);

        // log activity
        await activityService.add({
            user_id: req.user.id,
            action: `${req.user.group_name.toLowerCase()}.bank-account.add`,
            description: `${req.user.first_name} added new bank account`,
            section: 'Profile',
            subsection: 'Bank Accounts',
            data: { data: req.body },
            ip: null,
        });

        // response
        return res.send({ success: true });

    } catch (error) {
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function index(req, res) {
    try {
        const accounts = await bankAccountService.index(req.user.id);
        const { count, rows } = accounts;
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

async function show(req, res) {
    try {
        const account = await bankAccountService.show(req.params.id);
        return res.send({
            success: true,
            data: account,
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
        const data = req.body;

        // fetch user details
        const user = await userService.show(req.user.id);

        if (data.authenticate) {

            // create/log OTP record
            const otpRecord = {
                user_id: user.id,
                device: data.device || {},
                geoinfo: data.geoinfo || {},
                description: 'Updated bank account',
                transaction: `${req.user.group_name.toLowerCase()}.bank-account.update`,
                data: req.body,
            };
            const otp = await otpService.create(otpRecord);
    
            // send OTP auth
            if (otp.code) {
                const mobile = user.mobile.replace('+', '');
                await sendOTPAuth(mobile, otp.code);
            }
    
            // response
            return res.send({ success: true });
        }

        // update
        await bankAccountService.update(req.params.id, req.body);
        await activityService.add({
            user_id: req.user.id,
            action: `${req.user.group_name.toLowerCase()}.bank-account.update`,
            description: `${req.user.first_name} updated bank account`,
            section: 'Profile',
            subsection: 'Bank Accounts',
            data: { id: req.params.id, data: req.body },
            ip: null,
        });
    
        // response
        return res.send({ success: true });
    } catch (error) {
        console.log(error.message);
        return res.send({
            success: false,
            message: 'Could not process request'
        });
    }
}

async function destroy(req, res) {
    try {
        await bankAccountService.destroy(req.params.id);
        await activityService.add({
            user_id: req.user.id,
            action: `${req.user.group_name.toLowerCase()}.bank-account.delete`,
            description: `${req.user.first_name} deleted bank account`,
            section: 'Profile',
            subsection: 'Bank Accounts',
            data: { id: req.params.id },
            ip: null,
        });
        return res.send({ success: true });
    } catch (error) {
        console.log(error);
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
    destroy,
};
