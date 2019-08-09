const customException = require('../helper/customException');

function handleException(err, req, res, next) {

    errResp = {
        status: 500,
        error: err.message,
    }

    if (err instanceof customException.RequestError) {
        errResp.status = 400
    } else if (err instanceof customException.AuthenticationError) {
        errResp.status = 401
    } else {
        errResp.error = 'Internal server error';
    }

    res.status(errResp.status).send(errResp);
}

module.exports = {
    handleException
}