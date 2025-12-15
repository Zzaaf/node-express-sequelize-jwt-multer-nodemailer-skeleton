const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const { authLimiter, signUpLimiter } = require('../config/rateLimitConfig');

router
    .get('/refreshTokens', UserController.refreshTokens)
    .get('/activate/:token', UserController.activateAccount)
    // signUp - строгий лимит: 3 регистрации в час
    .post('/signUp', signUpLimiter, UserController.signUp)
    // signIn - строгий лимит: 5 попыток за 15 минут (защита от brute-force)
    .post('/signIn', authLimiter, UserController.signIn)
    .delete('/signOut', UserController.signOut);

module.exports = router;