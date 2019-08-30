const {validate, constraint, throwErr} = require('./validator');

function registerRequestValidate(data) 
{
    const schema = {
        full_name: constraint.string().max(255).required(),
        email: constraint.string().min(6).required(),
        phone: constraint.string().min(9).required(),
        password: constraint.string().min(6).max(256).required(),
    };


    return validate(data, schema)
    .catch(throwErr);
}

function loginRequestValidate(data)
{
    const schema = {
        email: constraint.string().min(6).required(),
        password: constraint.string().required()
    }

    return validate(data, schema)
    .catch(throwErr);
}

function verifyPhoneEmailRequestValidate(data) 
{
    const schema = {
        field: constraint.string().valid(['email', 'phone']).required(),
        value: constraint.string().min(5).required()
    }

    return validate(data, schema)
    .catch(throwErr);
}

module.exports = {
    registerRequestValidate,
    loginRequestValidate,
    verifyPhoneEmailRequestValidate
}