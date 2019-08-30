var Joi = require('@hapi/joi');
const customError = require('../helper/customError');

var validate = async function(data, schema) 
{
    return new Promise(function(resolve, reject) {
        Joi.validate(data, schema, function (err, res) {
            if (err)
                return reject(err);

            return resolve(res);
        })
    });
};

var constraint = Joi;

var throwErr = function(err) {
    throw customError.createRequestValidateError(
        {
            message: err.details[0].message, 
            field: err.details[0].message.match(/"(.+)"/)[1]
        })
}

module.exports = {
    validate,
    constraint,
    throwErr
}