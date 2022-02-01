const Joi = require('joi');

module.exports = {
    first_name: Joi.string()
        .required(),

    last_name: Joi.string()
        .required(),

    email: Joi.string()
        .email()
        .required(),

    username: Joi.string()
        .required(),

    mobile: Joi.string()
        .required(),

    password: Joi.string()
        .required(),

    confirm_password: Joi.string()
        .required(),

    marketing: Joi.boolean()
        .allow(false, null),

    terms_agree: Joi.boolean()
        .required(),

    referral_id: Joi.string()
        .required(),

    device: Joi.object()
        .allow({}, null),

    geoinfo: Joi.object()
        .allow({}, null),

    country: Joi.string()
        .allow('', null),

    timezone: Joi.string()
        .allow('', null),
};