const WebUser = require('../models/WebUser');
const bcrypt = require('bcryptjs');
const mail = require('../helper/mail');
const RequestError = require('../helper/customException').RequestError;
const Joi = require('@hapi/joi');

var confirmUser = async function(req, res) {

   const user = await WebUser.findOne({u_confirm_token: req.query.token});
   user.u_confirm = true

   let userSaved = await user.save();

   console.log(userSaved)

};

function registerRequestValidation(data) {
    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    };

    const err = Joi.validate(data, schema);
    if (err) {
        throw new RequestError(err.error.details);
    }
}

function saveUserToDatabase(email) {
    WebUser.findOne({email: email}, (err, value) => {
        if (err) throw err;

        if (value) throw new RequestError('Email has already been registered');

        return createUser();
    });
}

async function createUser(err) {
    const salt = await bcrypt.genSalt(10)

    const hashPassword = await bcrypt.hash(body.password);
    const confirmToken = await bcrypt.hash(body.email);

      var user = new WebUser({
        u_first_name: body.first_name,
        u_last_name: body.last_name,
        u_email: body.email,
        u_password: hashPassword,
        u_confirm_token: confirmToken
    });

    return user;
}

var registerUser = async function(body) {
    const err = registerRequestValidation(body);

    var user = saveUserToDatabase(body.email);

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: user.u_email,
        subject: 'Confirm mail Sanve',
        text: process.env.URL + 'api/web_users/confirm?token=' + userSaved.u_confirm_token 
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