const { Task, User } = require('../db/models');

class TaskService {
    // Получить все задачи
    static getAllTasks() {
        return Task.findAll({
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        })
            .then((tasks) => tasks.map(task => task.get()))
            .catch((err) => {
                throw new Error(err.message);
            });
    }

    // Получить задачи определенного пользователя
    static getTasksByUserId(userId) {
        return Task.findAll({
            where: { user_id: userId },
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        })
            .then((tasks) => tasks.map(task => task.get()))
            .catch((err) => {
                throw new Error(err.message);
            });
    }

    // Получить задачу по ID
    static getTaskById(id) {
        return Task.findByPk(id, {
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        })
            .then((task) => task ? task.get() : null)
            .catch((err) => {
                throw new Error(err.message);
            });
    }

    // Создать новую задачу
    static createTask({ title, status, user_id }) {
        return Task.create({ title, status: status || false, user_id })
            .then((task) => task.get())
            .catch((err) => {
                throw new Error(err.message);
            });
    }

    // Обновить задачу
    static async updateTask(id, { title, status }) {
        try {
            const task = await Task.findByPk(id);
            if (!task) {
                return null;
            }

            if (title !== undefined) task.title = title;
            if (status !== undefined) task.status = status;

            await task.save();
            return task.get();
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Удалить задачу
    static deleteTask(id) {
        return Task.destroy({ where: { id } })
            .then((result) => result)
            .catch((err) => {
                throw new Error(err.message);
            });
    }
}

module.exports = TaskService;

