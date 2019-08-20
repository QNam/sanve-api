const User = require('../models/User');
const bcrypt  = require('bcryptjs');
const mail    = require('../helper/mail');
const Joi     = require('@hapi/joi');
const customError = require('../helper/customException');
const Logger = require('../helper/logger');
const validator = require('../validators/userValidator');
const errorCode = customError.errorCode;

const logger = new Logger().getInstance();

var confirmUser = async function(req, res) 
{

   const user = await User.findOne({confirm_token: req.query.token});
   user.status = User.ACTIVE;
 
   let userSaved = await user.save();

   return userSaved

}

async function saveUserToDatabase(body) 
{
    let user = await User.findOne({email: body.email});

    if (user) 
        throw customError.createRequestError(errorCode.badRequest, 'Account already existed');

    return createUser(body);
}

async function createUser(body) 
{
    const salt = await bcrypt.genSalt(10);

    var user = new User({
        full_name: body.full_name,
        email: body.email,
        phone: body.phone,
    });

    var passwordPromise = bcrypt.hash(body.password, salt)
    .then((pass) => user.password = pass);

    var tokenPromise = bcrypt.hash(body.email, salt)
    .then((token) => user.confirm_token = token);

    await Promise.all([passwordPromise, tokenPromise]);

    return user.save();
}


function sendMailToRegisteredUser(user)
{
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: user.email,
        subject: 'Confirm mail Sanve',
        text: process.env.URL + 'api/user/confirm?token=' + user.confirm_token 
    };

    mail.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}


var registerUser = async function(body) 
{
    logger.info('test');
    await validator.registerRequestValidation(body);

    var user = await saveUserToDatabase(body);

    // sendMailToRegisteredUser(user);

    return user;
}

module.exports.confirmUser = confirmUser;
module.exports.registerUser = registerUser;