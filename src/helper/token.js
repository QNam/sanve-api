var jwt = require('jsonwebtoken');
var { promisify } = require('util');

var signOptions = {
    algorithm: 'HS256',
    expiresIn: process.env.ACCESS_TOKEN_LIFE
}

async function generateAccessToken(user) {
    var payload = {
        id: user._id,
        email: user.email,
    }

    var sign = promisify(jwt.sign);

    return sign(payload, process.env.ACCESS_TOKEN_SECRET, signOptions);
}

module.exports = {
    generateAccessToken
}