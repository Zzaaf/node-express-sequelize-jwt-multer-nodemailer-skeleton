const router = require('express').Router();
const userRouter = require('./users.routes');
const authRouter = require('./auth.routes');
const tasksRouter = require('./tasks.routes');

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/tasks', tasksRouter);

module.exports = router;