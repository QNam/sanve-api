const Router = require('express-async-router').AsyncRouter;
const router = Router();
const userService = require('../service/userService');
const error = require('../helper/customException')

router.get('/confirm', async (req, res, next) => {
    await userService.confirmUser(req, res);
});

router.post('/register', async (req, res, next) => {
    const user = await userService.registerUser(req.body);

    res.send({ user: user });
});

module.exports = router;