const router = require('express').Router();
const userRouter = require('./users.routes');
const authRouter = require('./auth.routes');
const tasksRouter = require('./tasks.routes');
const { apiLimiter } = require('../config/rateLimitConfig');

// API rate limiter - 60 запросов в минуту на все API endpoints
router.use(apiLimiter);

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/tasks', tasksRouter);

module.exports = router;