const jwt = require('jsonwebtoken')
const AuthenticationError = require('../helper/customException').AuthenticationError;

function verifyToken(req, res, next) {

    const bearerHeader = req.headers['Authentication'];

    let flagError = false;
    let flagData  = {};

    if (!bearerHeader) {
        throw new AuthenticationError('Authentication Error');

    } else {

        const bearer = bearerHeader.split(" ");
        const access_token = bearer[1]


        const verified = jwt.verify(
            access_token,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, decoded) {
               
                if (err != null) {

                    flagError = true;

                    if (err.name == 'TokenExpiredError') {

                        throw new AuthenticationError('Token expired')
                    }

                    return res.status(400).send('Bad Request')
                } else {
                    flagData = decoded.user;
                }

            });
        
            
        if (!flagError) {
            
            req.user = flagData;

            next();
        }


    }
}

module.exports = {
    verifyToken
}