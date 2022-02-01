const Joi = require('joi');

module.exports = {
    user: Joi.string()
        .required(),

    password: Joi.string()
        .required(),

    device: Joi.object()
        .allow({}, null),

    geoinfo: Joi.object()
        .allow({}, null),
};