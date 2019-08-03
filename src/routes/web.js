const router = require('express').Router();
const Web = require('../models/Web')

router.get('/', async (req, res) => {
    
    const domain = req.query.domain
    let data = {}

    if(!domain) {
        return res.status(400).send('Bad Request')
    }

    try {
        
        data = await Web.findByDomain(domain)
        res.send(data)

    } catch(err) {
        if(err.name == "DomainNotExists")
            res.status(404).send(err)
    }

})

module.exports = router