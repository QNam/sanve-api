const {validate, constraint} = require('./validator');
const customError = require('../helper/customError');

function createRequestValidate(data)
{
    const schema = {
        name: constraint.string().required(),
        domain: constraint.string().min(4).max(255).required(),
        theme: constraint.number().required()
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
    createRequestValidate
}