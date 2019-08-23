// const Router = require('express-async-router').AsyncRouter;
// const router = Router();

var express = require('express');
var router = express.Router();
const Logger = require('../helper/logger');
const userService = require('../service/userService');
const smsService = require('../service/smsService');
const error = require('../helper/customError')

const logger = new Logger().getInstance();

router.get('/:uid/verify', async (req, res, next) => {
    userService.confirmUser(req.params.uid, req.query.OTP)
    .then(rs => res.send({ result: 'success' }))
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