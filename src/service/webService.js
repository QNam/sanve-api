const Web = require('../models/Web');
const customError = require('../helper/customException');
const errorCode = customError.errorCode;
const validator = require('../validators/webValidator');


async function findByDomain(domain)
{
    const web = await Web.findOne({ domain: domain })

    return web;
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
        },
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
    // validator.createRequestValidate(body);

    // return await saveWebToDataBase(body)
    return '{}';
}


module.exports = {

    registerWeb,
    findByDomain
    
}