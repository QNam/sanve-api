const {CustomError, errorCode} = require('../helper/customError');
const Logger = require('../helper/logger');

const logger = new Logger().getInstance();

function handleException(err, req, res, next) 
{
    logger.warn(err.stack);
    errResp = {
        status: 500,
        code: err.code,
        data: err.data
    }

    if (err instanceof CustomError) {
        errResp.status = err.status
    } else if (err instanceof SyntaxError) {
        errResp.status = 400;
        errResp.code = errorCode.badRequest;
        errResp.data = { message: err.message };

    } else {
        errResp.code = errorCode.unknown;
        errResp.data = { message: 'Internal server error' };
    }

    res.status(errResp.status).send(errResp);
}

module.exports = {
    handleException
}