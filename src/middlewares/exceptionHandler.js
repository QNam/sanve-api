const {CustomError} = require('../helper/customException');
const Logger = require('../helper/logger');

const logger = new Logger().getInstance();

function handleException(err, req, res, next) 
{
    logger.warn(err);
    errResp = {
        status: 500,
        code: err.code,
        data: err.data
    }

    if (err instanceof CustomError) {
        errResp.status = err.status
    } else {
        errResp.code = 1000;
        errResp.data = { message: 'Internal server error' };
    }

    res.status(errResp.status).send(errResp);
}

module.exports = {
    handleException
}