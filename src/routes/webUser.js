// const Router = require('express-async-router').AsyncRouter;
// const router = Router();

var express = require('express');
var router = express.Router();
const Logger = require('../helper/logger');
const userService = require('../service/userService');
const smsService = require('../service/smsService');
const error = require('../helper/customException')

const logger = new Logger().getInstance();

router.get('/confirm', async (req, res, next) => {
    await userService.confirmUser(req, res);
});

router.get('/:userId/verify', async (req, res, next) => {
    smsService.sendSMS('0362205275', 'test message')
    .catch(next);
});

router.post('/register', async (req, res, next) => {

    try {
    
        var user = await userService.registerUser(req.body);

        res.send({user});
    
    } catch(error) {

        next(error)

    }
    
});

router.post('/login', async (req, res, next) => {
    userService.userLogin(req.body)
    .then(rs => res.send(rs))
    .catch(next);
})

module.exports = router;