const User = require('../models/User');
const customError = require('../helper/customError');
const errorCode = customError.errorCode;
const validator = require('../validators/webValidator');
const Logger = require('../helper/logger');

const logger = new Logger().getInstance(); 

async function createWeb(body, user)
{

    const web = {
        name: body.name,
        domain: body.domain,
        theme: body.theme,
        created: {
            time: Date.now()
        },
        updated: {
            time: Date.now()
        }
    }

    web.created.user = user.id;
    web.updated.user = user.ud

    user.web = web;

    return checkDomainExisted(body.domain)
    .then(rs => {
        return user.updateOne({web: web});
    }).then(rs => {
        return user;
    });
}

async function checkDomainExisted(domain) 
{
    return User.findOne({ 'web.domain': domain })
    .then((user) => {
        if (user)
            throw customError.createRequestError(errorCode.badRequest, 'Domain already existed');
    })
}

var registerWeb = async function(req) 
{
    if (!req.locals.auth || req.locals.auth === User.statuses.INACTIVE)
        throw customError.createAuthorizationError(errorCode.accessDenied, 'Access denied');

    await validator.createRequestValidate(req.body);

    var user = await User.findById(req.locals.auth.id);

    var user = await createWeb(req.body, user);

    return user.web
}


module.exports = {
    registerWeb
}