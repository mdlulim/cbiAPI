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
const send = async (from, recipients, subject, body, callback = null, error = null) => {
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

module.exports = {
    send,
};