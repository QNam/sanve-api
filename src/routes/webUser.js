// const Router = require('express-async-router').AsyncRouter;
// const router = Router();

var express = require('express');
var router = express.Router();
const Logger = require('../helper/logger');
const userService = require('../service/userService');
const error = require('../helper/customException')

const logger = new Logger().getInstance();

router.get('/confirm', async (req, res, next) => {
    await userService.confirmUser(req, res);
});

router.post('/register', async (req, res, next) => {

    try {
    
        var user = await userService.registerUser(req.body);

        res.send({user});
    
    } catch(error) {

        next(error)

    }
    
});

module.exports = router;