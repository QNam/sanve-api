// const Router = require('express-async-router').AsyncRouter;
// const router = Router();

var express = require('express');
var router = express.Router();
const Logger = require('../helper/logger');
const userService = require('../service/userService');
const smsService = require('../service/smsService');
const error = require('../helper/customError');
const Permission = require('../models/Permission');
const { verifyPermission } = require('../middlewares/auth');

const logger = new Logger().getInstance();

router.get('/:uid/verify', async (req, res, next) => {
    userService.confirmUser(req.params.uid, req.query.OTP)
    .then(user => res.send({ user }))
    .catch(next);
});

router.post('/resend', verifyPermission(), async (req, res, next) => {
    user.service.resendVerificationSMS(user.locals.auth)
    .then(rs => {res.send({ result: "success" })})
    .catch(next);
})

router.post('/register', async (req, res, next) => {
    userService.registerUser(req.body)
    .then(user => res.send({ user }))
    .catch(next);
});

router.post('/login', async (req, res, next) => {
    userService.userLogin(req.body)
    .then(user => res.send({ user }))
    .catch(next);
})

module.exports = router;