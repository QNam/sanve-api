var errorCode = {
    badRequest: 2000,
    dataInvalid: 2001,

    authentication: 3000
}

function CustomError(status, code, message, data, fileName, lineNumber) 
{
    var instance = new Error(message, fileName, lineNumber);

    instance.status = status;
    instance.code = code;
    instance.data = data;

    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
}

CustomError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
});

if (Object.setPrototypeOf){
    Object.setPrototypeOf(CustomError, Error);
} else {
    CustomError.__proto__ = Error;
}

function createRequestValidateError(data) 
{
    return new CustomError(400, errorCode.badRequest, data.message, data);
}

function createRequestError(code, message) 
{
    return new CustomError(400, code, message, { message: message });
}

function createAuthenticationError(code, message) 
{
    return new CustomError(401, code, message, { message: message });
}

module.exports = {
    CustomError,
    createRequestValidateError,
    createRequestError,
    createAuthenticationError,
    errorCode
}