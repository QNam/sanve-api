var Joi = require('@hapi/joi');

var validate = async function(data, schema) {
    return new Promise(function(resolve, reject) {
        Joi.validate(data, schema, function (err, res) {
            if (err)
                return reject(err);

            return resolve(res);
        })
    })
}

module.exports = {
    validate
}