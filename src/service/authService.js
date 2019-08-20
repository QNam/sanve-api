const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const { errorCode, createAuthenticationError } = require('../helper/customException');

function verifyToken(headers, callback) 
{
    if (!headers) {
        throw createAuthenticationError(errorCode.authentication, 'Token invalid');
    }
        
    const bearer = bearerHeader.split(" ");
    const access_token = bearer[1];

    const decodedToken = null;
    const verified = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decoded) {
            
            if (err != null) {
                if (err != null && err.name == 'TokenExpiredError') {
                    err = createAuthenticationError(errorCode.authentication, 'Token expired');
                } else {
                    err = createAuthenticationError(errorCode.authentication, 'Token invalid');
                }

            } else {
                callback(err, decoded);
            }
        });
}

async function generateToken(user, expiredTime) {
    var payload = {
        id: user._id,
        email: user.email,
    }

    var sign = promisify(jwt.sign);

    return sign(payload, process.env.ACCESS_TOKEN_SECRET, signOptions);
}

module.exports = {
    verifyToken,
    generateToken
}