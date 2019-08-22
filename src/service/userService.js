const User = require('../models/User');
const bcrypt  = require('bcryptjs');
const crypto = require('crypto');
const mail    = require('../helper/mail');
const Joi     = require('@hapi/joi');
const customError = require('../helper/customException');
const Logger = require('../helper/logger');
const validator = require('../validators/userValidator');
const authService = require('./authService');
const smsService = require('./smsService');
const UserDTO = require('./dtos/UserDTO');
const randomizer = require('../helper/randomizer');
const errorCode = customError.errorCode;

const logger = new Logger().getInstance();

var confirmUser = async function(userId) 
{
   const user = await User.findOne({ _id: userId });
   user.status = User.ACTIVE;
 
   let userSaved = await user.save();

   return userSaved;
}

async function saveUserToDatabase(body) 
{
    var users = await User.find({ $or: [{email: body.email}, {phone: body.phone}]});

    if (users) {
        users.forEach(user => {
            logger.info(user._id);
            if (user.status > 0)
                throw customError.createRequestError(errorCode.badRequest, 'Account already existed');
            else 
                user.remove();
        });
    }
        
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

    user.password = await bcrypt.hash(body.password, salt)

    user.refresh_token = randomizer.generateRandomToken(40);

    var otp = randomizer.generateNumericCode(6);
    user.confirm_token.otp = otp;

    user.save().catch(err => {throw err});

    return user.toObject();
}


function sendVerificationSMS(user)
{
    content = user.confirm_token.otp + ' is your OTP at ' + process.env.APP_NAME;
    
    smsService.sendSMS(user.phone, content);
}

var registerUser = async function(body) 
{
    await validator.registerRequestValidate(body);

    var user = await saveUserToDatabase(body);

    // sendVerificationSMS(user);
    
    var accessToken = await authService.generateToken(user);
    logger.debug(accessToken);
    
    user.accessToken = accessToken;

    return user;
}

var userLogin = async function(body) 
{
    await validator.loginRequestValidate(body);

    var user = await User.findOne({email: body.email});
    if (!user) {
        throw customError.createAuthenticationError(errorCode.authentication, 
            'Invalid username/password');
    }

    var passMatched = await bcrypt.compare(body.password, user.password);
    if (!passMatched) {
        throw customError.createAuthenticationError(errorCode.authentication, 
            'Invalid username/password');
    }

    var accessToken = await authService.generateToken(user);
    logger.debug(accessToken);
    
    var dto = new UserDTO(user);
    dto.accessToken = accessToken;

    return dto;
}

module.exports.confirmUser = confirmUser;
module.exports.registerUser = registerUser;
module.exports.userLogin = userLogin;