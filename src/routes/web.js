const router = require('express').Router();
const Web = require('../models/Web');
const verifyToken = require('../service/authService').verifyToken;

router.get('/' ,async (req, res) => {
    
    const domain = req.query.domain

    const web = await webService.findByDomain(domain)

    res.send(web)
})

router.post('/create' , async (req, res) => {
    
    const web = await webService.createWeb(req.body)

    res.send(web)

})

module.exports = router