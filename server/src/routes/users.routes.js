const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const upload = require('../config/uploadConfig');
const verifyAccessToken = require('../middleware/verifyAccessToken');

// Непараметризированные обработчики (с контроллером)
router.route('/')
    // Read
    .get(UserController.getAllUsers)

// Параметризированные обработчики (c контроллером)
router.route('/:id')
    // Read
    .get(UserController.getUserById)
    // Update
    .put(verifyAccessToken, UserController.updateUserProfile)
    // Delete
    .delete(UserController.deleteUserById)

// Загрузка аватара
router.put('/:id/avatar', verifyAccessToken, upload.single('avatar'), UserController.uploadAvatar);

module.exports = router;