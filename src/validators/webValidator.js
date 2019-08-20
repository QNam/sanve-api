const validator = require('./validator');

function createRequestValidate(data)
{
    const schema = {
        name: Joi.string().required(),
        domain: Joi.string().min(6).max(255).required(),
        theme: Joi.string().max(10).required()
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

module.exports = createRequestValidate;