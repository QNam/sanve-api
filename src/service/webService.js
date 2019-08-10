const Web = require('../models/Web');
const Joi = require('@hapi/joi');
const RequestError = require('../helper/customException').RequestError;


async function findByDomain(domain)
{
    const web = await Web.findOne({ domain: domain })

    return web;
}

function createRequestValidate(data)
{
    const schema = {
        domain: Joi.string().min(6).max(255).required(),
        theme: Joi.string().max(10).required(),
        web_user_id: Joi.string().max(255).required(),
    };

    Joi.validate(data, schema, (err, val) => {
   
        if (err)
            throw new RequestError({ error: err.details[0].message });
    });
}


async function saveWebToDataBase(body)
{

    const web = new Web({
        domain: body.domain,
        theme: body.theme,
        web_user_id: body.web_user_id,
    })

    return await web.save();


}

var createWeb = async function(body)
{
    createRequestValidate(body);

    return await saveWebToDataBase(body)

}


module.exports = {

    createWeb,
    findByDomain
    
}