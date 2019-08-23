const authService = require('../service/authService');
const customError = require('../helper/customError');

function verifyPermission(permission)
{
    return function(req, res, next) 
    {
        authService.verifyToken(req.header('Authorization'))
        .then (decoded => {
            if (!hasPermission(permission, decoded)) {
                next(customError.createAuthorizationError(customError.errCode.accessDenied, 'Access denied'));
            }

            next();
        })
        .catch(next);
    }
}

function hasPermission(permission, payload)
{
    if (permission === '') return true;
    
    return payload.permissions.includes(permission);
}

// function verifyToken(req, res, next) 
// {

//     const bearerHeader = req.headers['Authentication'];

//     let flagError = false;
//     let flagData  = {};

//     if (!bearerHeader) {
//         throw new AuthenticationError('Authentication Error');

//     } else {

//         const bearer = bearerHeader.split(" ");
//         const access_token = bearer[1]


//         const verified = jwt.verify(
//             access_token,
//             process.env.ACCESS_TOKEN_SECRET,
//             function (err, decoded) {
               
//                 if (err != null) {

//                     flagError = true;

//                     if (err.name == 'TokenExpiredError') {

//                         throw new AuthenticationError('Token expired')
//                     }

//                     return res.status(400).send('Bad Request')
//                 } else {
//                     flagData = decoded.user;
//                 }

//             });
        
            
//         if (!flagError) {
            
//             req.user = flagData;

//             next();
//         }


//     }
// }

module.exports = {
    verifyPermission
}