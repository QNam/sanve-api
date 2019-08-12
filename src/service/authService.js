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

function generateToken(user, expiredTime, callback) 
{
    var tokenPayload = {
        email: user.email
    };

    jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, 
        { algorithm: 'RS256', expiresIn: expiredTime }, callback);
}

module.exports = {
    verifyToken,
    generateToken
}