const Joi = require('@hapi/joi');


const appRegisterValidation = (data) => 
{
    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    };

    return Joi.validate(data, schema);
}

const appLoginValidation = (data) => 
{
    const schema = {
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    };

    return Joi.validate(data, schema);
}

module.exports = {
    appRegisterValidation,
    appLoginValidation,
}

