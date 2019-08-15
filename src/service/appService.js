const App    = require('../models/App');
const bcrypt = require('bcryptjs');
const Joi    = require('@hapi/joi');
const jwt    = require('jsonwebtoken');
const customError = require('../helper/customException');
const errorCode = customError.errorCode;


function registerRequestValidation(data) 
{
    const schema = {
        email: Joi.string().min(6).email().max(255).required(),
        name: Joi.string().min(1).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
    };

    Joi.validate(data, schema, (err, val) => {
        if (err)
            throw customError.createRequestValidateError(
                {
                    message: err.details[0].message, 
                    field: err.details[0].message.match(/"(.+)"/)[1]
                },
            );
    });
    
}


function loginRequestValidation(data) 
{
    const schema = {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    };

    Joi.validate(data, schema, (err, val) => {
       
        if (err){
            throw customError.createRequestValidateError(
                {
                    message: err.details[0].message, 
                    field: err.details[0].message.match(/"(.+)"/)[1]
                },
            );
        }
            
    });
    
}

async function checkAppToLogin(data)
{
    let app = await App.findOne({a_email: data.email})

    
    if(!app) {
        throw customError.createAuthenticationError(3000, 'Email/Password invalid');
    }
    
    let checker = await bcrypt.compare(data.password, app.a_password)

    if(!checker) {
        throw customError.createAuthenticationError(3000, "Email/Password invalid");
    } 

    return true;
}


var  loginApp = async function (body)
{
    let checker = false;
    
        
    loginRequestValidation(body)

    checker = await checkAppToLogin(body)    
    

    const app = await App.findOne({a_email: body.email});

    const jwtPayLoad = {
        _id: app._id,
        a_name: app.a_name,
        a_email: app.a_email
    }

    //TODO: jwt create token
    const accessToken = jwt.sign(
        {app: jwtPayLoad},  
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_LIFE,
        }, 
    );

    return accessToken;
     
}

async function saveAppToDatabase(body) 
{
    try {

        const app = await App.findOne({a_email: body.email});
        if (app) throw customError.createRequestError(errorCode.badRequest, 'Account already existed');
        
    } catch (error) {
        throw error;
    }
    

    return createApp(body);
}



async function createApp(body) 
{
    const salt = await bcrypt.genSalt(10)

    const hashPassword = await bcrypt.hash(body.password, salt);

    let app = new App({
        a_name: body.name,
        a_email: body.email,
        a_password: hashPassword,
    });

    
    const jwtPayload = {
        a_name: body.name,
        a_email: body.email,
        a_password: hashPassword,
    }

    const refreshToken = jwt.sign(
        {app: jwtPayload},  
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_LIFE,
        }, 
    );
    
    app.a_refresh_token = refreshToken;

    return await app.save();
}


var registerApp = async function(body) 
{
    let app = {}

    try {
        
        registerRequestValidation(body);

        app = await saveAppToDatabase(body);

    } catch (error) {

        throw error

    }
    
    return app;
}

module.exports = {
    registerApp,
    loginApp
}