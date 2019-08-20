// const Router = require('express-async-router').AsyncRouter;
// const router = Router();

var express = require('express');
var router = express.Router();
var authenticate = require('../middlewares/auth');

const webService = require('../service/webService');

router.get('/' ,async (req, res, next) => {
    
    const domain = req.query.domain

    try {

        const web = await webService.findByDomain(domain)

        res.send(web)

    } catch(eror) {

        next(eror);
        
    }
})

router.post('/create' , 
    async (req, res, next) => {
    
    try {
        const web = await webService.registerWeb(req.body)

        res.send(web)

    } catch (error) {
        next(error)
    }
    

})

module.exports = router