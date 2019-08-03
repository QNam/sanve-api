const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken')

const User     = require('../models/App');
const { appRegisterValidation, appLoginValidation } = require('../validation');
const { auth } = require('../middlewares/auth');

router.post('/check_token', (req, res) => { 

    const token = req.body.token;
    let flagError = true;

    console.log(token)
    const verified = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decoded) {
           
            if (err != null) {

                flagError = false;

            }

        });
    
        res.send({status: flagError});
})


router.post('/refresh_token', async (req, res) => { 

    const token = req.body.token;

    const user = await User.findOne({access_token: token});

    console.log(user)
    
})



router.post('/register', async (req, res) => {
    
    const { error } = appRegisterValidation(req.body);

    if( error ) return res.status(400).send(error)
    
    const emailExists = await User.findOne({a_email: req.body.email});

    if(emailExists) {
        return res.status(400).send('Email already exists !')        
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    var user = new User({
        a_name: req.body.name,
        a_email: req.body.email,
        a_password: hashPassword,
    });
    
    try {
        
        let userSaved = await user.save();
        res.send(userSaved);

    } catch(err) {
        res.status(400).send(err)
    }

})


router.post('/login', async (req, res) => {
    
    const { error } = appLoginValidation(req.body);

    if( error ) return res.status(400).send(error)

    const user = await User.findOne({a_email: req.body.email});


    if(!user) return res.status(400).send('Email or password is wrong !')        
    
    const validPass = await bcrypt.compare(req.body.password, user.a_password);

    if( !validPass ) return res.status(400).send('Email or password is wrong !') 

    let userSaved = {
        _id: user._id,
        a_name: user.a_name,
        a_email: user.a_email, 
    }
    const access_token = jwt.sign(
            {user: userSaved},
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_LIFE,
            }
        );
    
    const refresh_token = jwt.sign(
            {user: userSaved},  
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_LIFE,
            }, 
        );
    
    
    user.access_token = access_token;
    user.refresh_token = refresh_token;
    await user.save();

    res.send({access_token, refresh_token})
    
})


module.exports = router