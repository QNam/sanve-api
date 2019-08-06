const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const AuthenticationError = require('../helper/customException').AuthenticationError;

function verifyToken(headers, callback) {
    if (!headers) {
        throw new AuthenticationError('Authentication Error');
    }
        
    const bearer = bearerHeader.split(" ");
    const access_token = bearer[1]

    const decodedToken = null;
    const verified = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decoded) {
            
            if (err != null) {
                if (err != null && err.name == 'TokenExpiredError') {
                    err = new AuthenticationError('Token expired');
                } else {
                    err = new AuthenticationError('Token invalid');
                }

            } else {
                callback(err, decoded);
            }
        });
}

function generateToken(user, expiredTime, callback) {
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