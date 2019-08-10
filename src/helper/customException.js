function createError(name, init) 
{
    
    function Err(message) {
        Error.captureStackTrace(this, this.constructor);
        this.message = message;
        init && init.apply(this, arguments);
    }

    Error.prototype = new Error();
    //set the name property
    Error.prototype.name = name;
    // set the constructor
    Error.prototype.constructor = Err;

    return Error;
}

var RequestError = createError('RequestError', function (message) {
    this.message = message; 
});

var AuthencticationError = createError('AuthencticationError', function(message) {
    this.message = message;
});

module.exports = {
    RequestError,
    AuthencticationError,
}