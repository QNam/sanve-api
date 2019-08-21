// const Router = require('express-async-router').AsyncRouter;
// const router = Router();

var express = require('express');
var router = express.Router();
var authenticate = require('../middlewares/auth');
var Logger = require('../helper/logger');

var logger = new Logger().getInstance();

const webService = require('../service/webService');

router.get('/' ,async (req, res, next) => {
    
    const domain = req.query.domain

    webService.findByDomain(domain)
    .then(web => res.send(web))
    .catch(next);
});

router.post('/create', authenticate.verifyPermission(''),
    async (req, res, next) => {

        webService.registerWeb(req.body)
        .then(web => res.send(web))
        .catch(next);
});

module.exports = router;