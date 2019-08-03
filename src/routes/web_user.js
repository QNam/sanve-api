const router = require('express').Router();
const WebUser = require('../models/WebUser')
const bcrypt = require('bcryptjs')
const mail = require('../helper/mail')

router.get('/confirm', async (req, res) => {
    
    const user = await WebUser.findOne({u_confirm_token: req.query.token})
    user.u_confirm = true

    let userSaved = await user.save();

    console.log(userSaved)

})

router.post('/register', async (req, res) => {



    const emailExists = await WebUser.findOne({email: req.body.email});

    if(emailExists) {
        return res.status(400).send('Email already exists !')        
    }

    const salt = await bcrypt.genSalt(10)

    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const confirmToken = await bcrypt.hash(req.body.email, salt)

    var user = new WebUser({
        u_first_name: req.body.first_name,
        u_last_name: req.body.last_name,
        u_email: req.body.email,
        u_password: hashPassword,
        u_confirm_token: confirmToken
    });

    try {
        
        let userSaved = await user.save();
        res.send(userSaved);

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: userSaved.u_email,
            subject: 'Confirm mail Sanve',
            text: process.env.URL + 'api/web_users/confirm?token=' + userSaved.u_confirm_token 
        };

        mail.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

    } catch(err) {
        res.status(400).send(err)
    }

})

module.exports = router