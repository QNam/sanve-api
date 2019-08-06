// const Router = require('express-async-router').AsyncRouter;
// const router = Router();
var express = require('express');
var router = express.Router();

const User     = require('../models/App');
const { appLoginValidation } = require('../validation');
const { verifyToken } = require('../service/authService');

router.post('/register', async (req, res, next) => {
    
    try {
        
        const app = await appService.registerApp(req.body)

        res.send(app)

    } catch (err) {

        next(err);
    }
    

});

router.post('/login', async (req, res, next) => {
    
    try {
        const token = await appService.loginApp(req.body)

        res.send({token})
    } catch (err) {
        
        next(err);
    }
})




module.exports = router