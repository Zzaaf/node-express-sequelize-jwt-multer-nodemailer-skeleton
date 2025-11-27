const router = require('express').Router();
const UserController = require('../controllers/user.controller');

router
    .get('/refreshTokens', UserController.refreshTokens)
    .get('/activate/:token', UserController.activateAccount)
    .post('/signUp', UserController.signUp)
    .post('/signIn', UserController.signIn)
    .delete('/signOut', UserController.signOut);

module.exports = router;