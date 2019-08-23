const User = require('../models/User');
const bcrypt  = require('bcryptjs');
const crypto = require('crypto');
const mail    = require('../helper/mail');
const Joi     = require('@hapi/joi');
const customError = require('../helper/customError');
const Logger = require('../helper/logger');
const validator = require('../validators/userValidator');
const authService = require('./authService');
const smsService = require('./smsService');
const UserDTO = require('./dtos/UserDTO');
const randomizer = require('../helper/randomizer');
const errorCode = customError.errorCode;

const logger = new Logger().getInstance();
const OTP_LIFE = parseInt(process.env.OTP_LIFE)
const OTP_RESEND_CYCLE = parseInt(process.env.OTP_RESEND_CYCLE)

var confirmUser = async function(userId, otpCode) 
{
    var user = await User.findById(userId).exec().catch(err => {throw err});
    console.log(User.statuses);

    if (user.status == User.statuses.INACTIVE && user.confirm_token.otp === otpCode) {
        if (Date.now() - user.confirm_token.last_send > OTP_LIFE)
            throw customError.createRequestError(errorCode.dataInvalid, 'OTP expired');

        user.status = User.statuses.ACTIVE;
        user.confirm_token.tried = 0;
        user.confirm_token.otp = "";
    } else {
        user.confirm_token += 1;

        // reset otp if too many incorrect attempt
        if (user.confirm_token > 3) {
            var otp = randomizer.generateNumericCode(6);
            user.confirm_token.otp = otp;
        }

        throw customError.createRequestError(errorCode.dataInvalid, 'invalid OTP code') 
    }

    return user.save();
}

async function createUser(body) 
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
        
    return createUserTokens(body);
}

async function createUserTokens(body) 
{
    const salt = await bcrypt.genSalt(10);

    var user = new User({
        full_name: body.full_name,
        email: body.email,
        phone: body.phone,
    });

    user.password = await bcrypt.hash(body.password, salt);

    user.refresh_token = randomizer.generateRandomToken(40);

    var otp = randomizer.generateNumericCode(6);
    user.confirm_token.otp = otp;

    return user;
}


async function sendVerificationSMS(user)
{
    content = user.confirm_token.otp + ' is your OTP at ' + process.env.APP_NAME;
    var lastSend = user.confirm_token.last_send ? user.confirm_token.last_send : 0;
    logger.debug(lastSend);

    if (Date.now() - lastSend > OTP_RESEND_CYCLE) {
        logger.info("send sms to " + user.phone);
        
        return smsService.sendSMS(user.phone, content)
        .then(rs => {
            user.confirm_token.last_send = Date.now();
        });
    }
}

var registerUser = async function(body) 
{
    await validator.registerRequestValidate(body);

    var user = await createUser(body);

    await sendVerificationSMS(user);

    user.save().catch(err => {throw err});
    
    var accessToken = await authService.generateToken(user);
    logger.debug(accessToken);

    var dto = new UserDTO(user);
    dto.accessToken = accessToken;

    return dto;
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

module.exports = {
    confirmUser,
    registerUser,
    userLogin
}