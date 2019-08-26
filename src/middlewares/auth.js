const authService = require('../service/authService');
const customError = require('../helper/customError');
const errorCode = customError.errorCode;
const Logger = require('../helper/logger');

const logger = new Logger().getInstance();

function verifyPermission(permission)
{
    return function(req, res, next) 
    {
        authService.verifyToken(req.header('Authorization'))
        .then (decoded => {
            if (!hasPermission(permission, decoded)) {
                logger.info('no permisson: ', permission);

                next(customError.createAuthorizationError(errorCode.accessDenied, 'Access denied'));
            }

            // set authentication to request object
            req.locals = req.locals ? req.locals : {};
            req.locals.auth = decoded;

            next();
        })
        .catch(next);
    }
}

function hasPermission(permission, payload)
{
    if (!permission) return true;

    return payload.permission && payload.permission.includes(permission);
}

module.exports = {
    verifyPermission
}