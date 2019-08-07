const App    = require('../models/App');
const bcrypt = require('bcryptjs');
const Joi    = require('@hapi/joi');
const jwt    = require('jsonwebtoken');
const RequestError = require('../helper/customException').RequestError;


function registerRequestValidation(data) 
{
    const schema = {
        email: Joi.string().min(6).max(255).required(),
        name: Joi.string().min(1).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
    };

    Joi.validate(data, schema, (err, val) => {
        console.log(err);
        if (err)
            throw new RequestError({ error: err.details[0].message });
    });
    
}


function loginRequestValidation(data) 
{
    const schema = {
        email: Joi.string().required(),
        password: Joi.string().required(),
    };

    Joi.validate(data, schema, (err, val) => {
        console.log(err);
        if (err)
            throw new RequestError({ error: err.details[0].message });
    });
    
}

async function checkAppToLogin(data)
{
    let app = await App.findOne({a_email: data.email})

    
    if(!app) {
        throw new RequestError("Accout not exists !");
    }
    
    let checker = await bcrypt.compare(data.password, app.a_password)

    if(!checker) {
        throw new RequestError("Password is wrong !");
    } 

    return true;
}


var  loginApp = async function (body)
{

    loginRequestValidation(body)

    let checker = checkAppToLogin(body)

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

function saveAppToDatabase(body) 
{
    App.findOne({email: body.email}, (err, value) => {
        if (err) throw err;

        if (value) throw new RequestError('Email has already been registered');

    });

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

    const err = registerRequestValidation(body);

    let app = await saveAppToDatabase(body);

    return app;
}

module.exports = {
    registerApp,
    loginApp
}