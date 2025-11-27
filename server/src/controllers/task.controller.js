const TaskService = require('../services/task.service');
const formatResponse = require('../utils/formatResponse');

class TaskController {
    // Получить все задачи
    static async getAllTasks(req, res) {
        try {
            const tasks = await TaskService.getAllTasks();
            res.json(formatResponse(200, 'All tasks', tasks));
        } catch (error) {
            res.status(500).json(formatResponse(500, 'Failed to get tasks', null, error.message));
        }
    }

    // Получить задачи пользователя
    static async getTasksByUserId(req, res) {
        try {
            const { userId } = req.params;
            const tasks = await TaskService.getTasksByUserId(userId);
            res.json(formatResponse(200, 'User tasks', tasks));
        } catch (error) {
            res.status(500).json(formatResponse(500, 'Failed to get user tasks', null, error.message));
        }
    }

    // Получить задачу по ID
    static async getTaskById(req, res) {
        try {
            const { id } = req.params;
            const task = await TaskService.getTaskById(id);

            if (!task) {
                return res.status(404).json(formatResponse(404, 'Task not found'));
            }

            res.json(formatResponse(200, 'Task', task));
        } catch (error) {
            res.status(500).json(formatResponse(500, 'Failed to get task', null, error.message));
        }
    }

    // Создать новую задачу
    static async createTask(req, res) {
        try {
            const { title, status, user_id } = req.body;

            if (!title || typeof title !== 'string' || title.trim().length === 0) {
                return res.status(400).json(formatResponse(400, 'Title is required'));
            }

            if (!user_id) {
                return res.status(400).json(formatResponse(400, 'User ID is required'));
            }

            const task = await TaskService.createTask({ title, status, user_id });
            res.status(201).json(formatResponse(201, 'Task created successfully', task));
        } catch (error) {
            res.status(500).json(formatResponse(500, 'Failed to create task', null, error.message));
        }
    }

    // Обновить задачу
    static async updateTask(req, res) {
        try {
            // Задача уже получена и проверена в middleware verifyTaskOwner
            const task = res.locals.task;
            const { title, status } = req.body;

            // Обновляем только переданные поля
            if (title !== undefined) task.title = title;
            if (status !== undefined) task.status = status;

            await task.save();

            res.json(formatResponse(200, 'Task updated successfully', task.get()));
        } catch (error) {
            res.status(500).json(formatResponse(500, 'Failed to update task', null, error.message));
        }
    }

    // Удалить задачу
    static async deleteTask(req, res) {
        try {
            // Задача уже получена и проверена в middleware verifyTaskOwner
            const task = res.locals.task;

            await task.destroy();

            res.json(formatResponse(200, 'Task deleted successfully'));
        } catch (error) {
            res.status(500).json(formatResponse(500, 'Failed to delete task', null, error.message));
        }
    }
}

module.exports = TaskController;

