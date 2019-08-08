const WebUser = require('../models/WebUser');
const bcrypt  = require('bcryptjs');
const mail    = require('../helper/mail');
const Joi     = require('@hapi/joi');
const RequestError = require('../helper/customException').RequestError;

var confirmUser = async function(req, res) {

   const user = await WebUser.findOne({u_confirm_token: req.query.token});
   user.u_confirm = true
 
   let userSaved = await user.save();

}


function registerRequestValidation(data) {
    const schema = {
        first_name: Joi.string().max(255).required(),
        last_name: Joi.string().max(255).required(),
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    };

    Joi.validate(data, schema, (err, val) => {
        console.log(err);
        if (err)
            throw new RequestError(err.details[0].message);
    });
    
}

function saveUserToDatabase(body) 
{
   WebUser.findOne({email: body.email}, (err, value) => {
        if (err) throw err;

        if (value) throw new RequestError('Email has already been registered');

    });

    return createUser(body);
}

async function createUser(body) 
{
    const salt = await bcrypt.genSalt(10)

    const hashPassword = await bcrypt.hash(body.password, salt);
    const confirmToken = await bcrypt.hash(body.email, salt);

   let user = new WebUser({
        u_first_name: body.first_name,
        u_last_name: body.last_name,
        u_email: body.email,
        u_password: hashPassword,
        u_confirm_token: confirmToken
    });

    return await user.save();

}

var registerUser = async function(body) {

    const err = registerRequestValidation(body);

    var user = await saveUserToDatabase(body);


    const mailOptions = {
        from: process.env.MAIL_USER,
        to: user.u_email,
        subject: 'Confirm mail Sanve',
        text: process.env.URL + 'api/user/confirm?token=' + user.u_confirm_token 
    };

    mail.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });

    return user;
}

module.exports.confirmUser = confirmUser;
module.exports.registerUser = registerUser;