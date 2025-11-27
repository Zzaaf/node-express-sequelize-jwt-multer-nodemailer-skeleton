const { Task } = require('../db/models');
const formatResponse = require('../utils/formatResponse');

/**
 * Middleware для проверки владения задачей
 * Проверяет, что текущий пользователь является владельцем задачи
 */
async function verifyTaskOwner(req, res, next) {
    try {
        const { id } = req.params;
        const userId = res.locals.user.id; // ID из токена (установлен middleware verifyAccessToken)

        // Находим задачу
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json(formatResponse(404, 'Task not found'));
        }

        // Проверяем владение
        if (task.user_id !== userId) {
            return res.status(403).json(
                formatResponse(
                    403, 
                    'Access denied', 
                    null, 
                    'You can only modify your own tasks'
                )
            );
        }

        // Сохраняем задачу в res.locals для использования в контроллере
        res.locals.task = task;
        next();
    } catch (error) {
        return res.status(500).json(
            formatResponse(500, 'Internal server error', null, error.message)
        );
    }
}

module.exports = verifyTaskOwner;

