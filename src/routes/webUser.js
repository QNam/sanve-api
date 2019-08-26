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
    .then(rs => res.send({ user: rs }))
    .catch(next);
});

// TODO: resend verify OTP
router.post('/resend', verifyPermission(), async (req, res, next) => {

})

router.post('/register', async (req, res, next) => {
    userService.registerUser(req.body)
    .then(user => res.send({user}))
    .catch(next);
});

router.post('/login', async (req, res, next) => {
    userService.userLogin(req.body)
    .then(rs => res.send(rs))
    .catch(next);
})

module.exports = router;