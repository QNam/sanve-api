const validate = require('./validator');
const Joi = require('@hapi/joi');
const util = require('util');
const customError = require('../helper/customException');

// var validate = util.promisify(Joi.validate);

function registerRequestValidate(data) 
{
    const schema = {
        full_name: Joi.string().max(255).required(),
        email: Joi.string().min(6).required(),
        phone: Joi.string().min(9).required(),
        password: Joi.string().min(6).max(256).required(),
    };


    return validate.validate(data, schema)
    .catch(err => { 
        throw customError.createRequestValidateError(
            {
                message: err.details[0].message, 
                field: err.details[0].message.match(/"(.+)"/)[1]
            })
    });
}

function loginRequestValidate(data)
{
    const schema = {
        email: Joi.string().min(6).required(),
        password: Joi.string().required()
    }

    return validate.validate(data, schema)
    .catch(err => { 
        throw customError.createRequestValidateError(
            {
                message: err.details[0].message, 
                field: err.details[0].message.match(/"(.+)"/)[1]
            })
    });
}

module.exports = {
    registerRequestValidate,
    loginRequestValidate
}