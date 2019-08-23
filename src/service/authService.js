const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const { promisify } = require('util');
const crypto = require('crypto');
const { errorCode, createAuthenticationError } = require('../helper/customError');

const signOptions = {
    algorithm: 'HS256',
    expiresIn: process.env.ACCESS_TOKEN_LIFE
}

function verifyToken(headers) 
{
    if (!headers) {
        throw createAuthenticationError(errorCode.authentication, 'Token invalid');
    }
        
    const bearer = headers.split(" ");
    const access_token = bearer[1];

    var verify = promisify(jwt.verify);

    return verify(access_token, process.env.ACCESS_TOKEN_SECRET)
    .catch(err => {
        if (err.name == 'TokenExpiredError') {
            throw createAuthenticationError(errorCode.authentication, 'Token expired');
        } else {
            throw createAuthenticationError(errorCode.authentication, 'Token invalid');
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

async function generateRefreshToken(user) {

}

module.exports = {
    verifyToken,
    generateToken
}