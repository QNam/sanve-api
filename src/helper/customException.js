function createError(name, init) {
    function Err(message) {
    Error.captureStackTrace(this, this.constructor);
    this.message = message;
    init && init.apply(this, arguments);
}

    Err.prototype = new Error();
    //set the name property
    Err.prototype.name = name;
    // set the constructor
    Err.prototype.constructor = Err;
    return Err;
}

var RequestError = createError('RequestError', function(message) {
    this.message = message;
});

var AuthencticationError = createError('AuthencticationError', function(message) {
    this.message = message;
});

module.exports = {
    RequestError,
    AuthencticationError,
}