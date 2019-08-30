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
        created: {
            time: Date.now()
        },
        updated: {
            time: Date.now()
        }
    }

    web.created.user = user.id;
    web.updated.user = user.id;

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
        logger.info(user);
        if (user)
            throw customError.createRequestError(errorCode.badRequest, 'Domain already existed');

        return user;
    });
}

var registerWeb = async function(req) 
{
    if (!req.locals.auth || req.locals.auth === User.statuses.INACTIVE)
        throw customError.createAuthorizationError(errorCode.accessDenied, 'Access denied');

    await validator.createRequestValidate(req.body);

    var user = await User.findById(req.locals.auth.id);

    var user = await createWeb(req.body, user);

    return user.web;
}

var isDomainExisted = async function(domain)
{
    return checkDomainExisted(domain)
    .then(rs => {return false})
    .catch(err => {return true});
}

var updateTheme = async function(req)
{
    if (!req.locals.auth || req.locals.auth === User.statuses.INACTIVE)
        throw customError.createAuthorizationError(errorCode.accessDenied, 'Access denied');

    await validator.updateThemeRequestValidate(req.body);

    var user = await User.findById(req.locals.auth.id);

    user.web.theme = req.body.theme;
    user.web.updated.time = Date.now();
    user.web.updated.user = user._id;

    return user.save();
}

module.exports = {
    registerWeb,
    isDomainExisted,
    updateTheme
}