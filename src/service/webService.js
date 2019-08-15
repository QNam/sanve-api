const Web = require('../models/Web');
const Joi = require('@hapi/joi');
const customError = require('../helper/customException');
const errorCode = customError.errorCode;


async function findByDomain(domain)
{
    const web = await Web.findOne({ domain: domain })

    return web;
}

function createRequestValidate(data)
{
    const schema = {
        name: Joi.string().required(),
        domain: Joi.string().min(6).max(255).required(),
        theme: Joi.string().max(10).required(),
        web_user_id: Joi.string().max(255).required(),
    };

    Joi.validate(data, schema, (err, val) => {
   
        if (err)
            throw customError.createRequestValidateError(
                {
                    message: err.details[0].message, 
                    field: err.details[0].message.match(/"(.+)"/)[1]
                },
            );
    });
}

async function createWeb(body)
{

    const web = new Web({
        name: body.name,
        domain: body.domain,
        theme: body.theme,
        created: {
            user: body.web_user_id,
            time: Date.now()
        } 
    })

    return await web.save();
}


async function saveWebToDataBase(body)
{

    let user = await Web.findOne({domain: body.domain});

    if(user) {
        throw customError.createRequestError(errorCode.badRequest, 'Domain already existed');
    }

    return createWeb(body);
}

var registerWeb = async function(body) 
{
    createRequestValidate(body);

    return await saveWebToDataBase(body)

}


module.exports = {

    registerWeb,
    findByDomain
    
}