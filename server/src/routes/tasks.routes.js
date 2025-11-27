const router = require('express').Router();
const TaskController = require('../controllers/task.controller');
const verifyAccessToken = require('../middleware/verifyAccessToken');
const verifyTaskOwner = require('../middleware/verifyTaskOwner');

// Получить все задачи
router.get('/', TaskController.getAllTasks);

// Получить задачи конкретного пользователя
router.get('/user/:userId', TaskController.getTasksByUserId);

// Создать новую задачу (требует авторизации)
router.post('/', verifyAccessToken, TaskController.createTask);

// Получить задачу по ID
router.get('/:id', TaskController.getTaskById);

// Обновить задачу (требует авторизации и владения)
router.put('/:id', verifyAccessToken, verifyTaskOwner, TaskController.updateTask);

// Удалить задачу (требует авторизации и владения)
router.delete('/:id', verifyAccessToken, verifyTaskOwner, TaskController.deleteTask);

module.exports = router;

