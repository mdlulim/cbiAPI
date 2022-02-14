const nodemailer = require('nodemailer');
const config     = require('../config');

/**
 * Send mail
 * -----------------------------------------------------------
 * @param {object} from          sender
 * @param {string} recipients    list of receivers (comma separated)
 * @param {string} subject       subject
 * @param {object} body          body [ html, text and/or attachments ]
 * @param {function} callback    callback function <optional>
 * @param {function} error       error callback function <optional>
 */
const sendMail = async (from, recipients, subject, body, callback = null, error = null) => {
    try {
        var message = {
            from : `${from.name} <${from.email}>`, // sender address
            to   : recipients,                     // list of receivers (comma separated)
            text : body.text || '',                // plain text body
            html : body.html || '',                // html body
            subject
        };
        if (body.attachments) {
            message.attachments = body.attachments;
        }
        const transporter = await nodemailer.createTransport(config.mail.smtp);
        const info = await transporter.sendMail(message)
            .then(res => {
                if (typeof callback === 'function') {
                    callback(res);
                    return true;
                }
                return res;
            })
            .catch(err => {
                if (typeof error === 'function') {
                    error(err);
                } else {
                    throw err;
                }
            });

        return info;

    } catch (err) {
        if (typeof error === 'function') {
            error(err);
        } else {
            throw err;
        }
    }
};

function calculateSellCBIX7(data) {
    const {
        exchangeRate,
        tokenAmount, // The number of tokens the member/WC would like to sell at a point in time.
        fees,
        bpt,  // BPT value - configurable attribute on the admin side
        usd,
    } = data;

    console.log('params', data);

    // step 1
    let amount = parseFloat(parseFloat(tokenAmount) * parseFloat(bpt));

    // step 2
    // Calculate CBI Dollar value by Dividing the ZAR Value with the USD Value Now
    amount /= usd;

    // Convert the Total CBIs to ZAR Value 
    // Results here/below will give total CBI exchange value (For now ZAR is used: CBI * ZAR value)
    amount *= exchangeRate;

    // ZAR Value / CBI Value configured by Admin
    // amount /= exchangeRate;

    // Subtract slippage fee from revised amount after admin fee deduction | Attribute (slippage_fee)
    // slippage fee is a percentage, use percentage value to calculate fee
    let slippage = 0;
    if (fees.slippage_percentage_sell) slippage = fees.slippage_percentage_sell;
    const feeAmount = parseFloat(amount * (parseFloat(slippage) / 100));
    amount -= feeAmount;

    // return final token amount
    return {
        amount,
        feeAmount,
    };
}

function getFixedPlanFee(amount, fees) {
    const {
        registration_fee,
        commission_percentage,
        registration_percentage,
    } = fees;
    let feeAmount = 0;

    // plus commission percentage
    if (commission_percentage) {
        feeAmount += (parseFloat(commission_percentage) * parseFloat(amount) / 100);
    }

    // plus registration fee / percentage
    if (registration_percentage) {
        feeAmount += (parseFloat(registration_percentage) * parseFloat(amount) / 100);
    } else if (registration_fee) {
        feeAmount += parseFloat(registration_fee);
    }
    return feeAmount;
}

module.exports = {
    sendMail,
    calculateSellCBIX7,
    getFixedPlanFee,
};