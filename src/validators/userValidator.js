const {validate, constraint} = require('./validator');
const customError = require('../helper/customError');

function registerRequestValidate(data) 
{
    const schema = {
        full_name: constraint.string().max(255).required(),
        email: constraint.string().min(6).required(),
        phone: constraint.string().min(9).required(),
        password: constraint.string().min(6).max(256).required(),
    };


    return validate(data, schema)
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
        email: constraint.string().min(6).required(),
        password: constraint.string().required()
    }

    return validate(data, schema)
    .catch(err => { 
        throw customError.createRequestValidateError(
            {
                message: err.details[0].message, 
                field: err.details[0].message.match(/"(.+)"/)[1]
            })
    });
}

function verifyPhoneEmailRequestValidate(data) 
{
    const schema = {
        field: constraint.string().valid(['email', 'phone']).required(),
        value: constraint.string().min(5).required()
    }

    return validate(data, schema)
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
    loginRequestValidate,
    verifyPhoneEmailRequestValidate
}