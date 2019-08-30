const {validate, constraint, throwErr} = require('./validator');
const customError = require('../helper/customError');

function createRequestValidate(data)
{
    const schema = {
        name: constraint.string().required(),
        domain: constraint.string().min(4).max(255).required(),
    }

    return validate(data, schema)
    .catch(throwErr);
}

function updateThemeRequestValidate(data)
{
    const schema = {
        theme: constraint.string().required()
    }

    return validate(data, schema)
    .catch(throwErr);
}

module.exports = {
    createRequestValidate,
    updateThemeRequestValidate
}