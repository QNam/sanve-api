// const Router = require('express-async-router').AsyncRouter;
// const router = Router();

var express = require('express');
var router = express.Router();
var authenticate = require('../middlewares/auth');
var Logger = require('../helper/logger');
const Permission = require('../models/Permission');

var logger = new Logger().getInstance();

const webService = require('../service/webService');

router.post('/create', authenticate.verifyPermission(Permission.CREATE_WEB),
    async (req, res, next) => {
        webService.registerWeb(req)
        .then(web => res.send({ web }))
        .catch(next);
});

router.post('/theme', authenticate.verifyPermission(Permission.CREATE_WEB),
    async (req, res, next) => {
        webService.updateTheme(req)
        .then(rs => res.send({ result: 'success' }))
        .catch(next);
});

router.get('/domain/existence', authenticate.verifyPermission(Permission.CREATE_WEB),
    async (req, res, next) => {
        webService.isDomainExisted(req.query.domain)
        .then(existed => res.send({ existed }))
        .catch(next);
});

module.exports = router;