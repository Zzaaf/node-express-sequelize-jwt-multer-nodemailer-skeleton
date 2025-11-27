const { where } = require('sequelize');
const { User } = require('../db/models');

class UserService {
    // нужно чтобы вернул массив пользователей, без мета-данных
    static getAllUsersWithoutMeta() {
        return User.findAll()
            .then((arr) => arr.map(el => el.get()))
            .catch((err) => err.message)
    }

    // нужно чтобы вернул пользователя по email
    static async getByEmail(email) {
        // .then
        // return User.findOne({ where: { email } })
        //     .then((el) => el ? el.get() : null)
        //     .catch((err) => err.message)

        // async/await
        try {
            const user = await User.findOne({ where: { email } });
            // Если пользователь не найден, возвращаем null вместо ошибки
            if (!user) {
                return null;
            }
            return user.get();
        } catch (error) {
            return error.message;
        }
    }

    // нужно чтобы вернул пользователя по ID
    static getUserById(id) {
        return User.findByPk(id)
            .then((user) => user)
            .catch((err) => err.message)
    }

    // нужно чтобы вернул нового пользователя
    static async createUser({ name, email, password, activationToken = null }) {
        return User.create({ name, email, password, activationToken })
            .then((user) => {
                const userData = user.get();
                delete userData.password; // Удаляем пароль из ответа
                return userData;
            })
            .catch((err) => err.message)
    }

    // нужно чтобы удалил пользователя по ID
    static deleteUserById(id) {
        return User.destroy({ where: { id } })
            .then((user) => user)
            .catch((err) => err.message)
    }

    // нужно чтобы обновил имя и email пользователя
    static async updateUser(id, { name, email }) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return null;
            }

            // Обновляем поля
            if (name) user.name = name.trim();
            if (email) user.email = email.trim().toLowerCase();

            await user.save();
            const updatedUser = user.get();
            delete updatedUser.password;
            return updatedUser;
        } catch (error) {
            return error.message;
        }
    }

    // нужно чтобы обновил аватар пользователя
    static async updateAvatar(id, avatarPath) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return null;
            }

            user.avatar = avatarPath;
            await user.save();
            const updatedUser = user.get();
            delete updatedUser.password;
            return updatedUser;
        } catch (error) {
            return error.message;
        }
    }

    // Получить пользователя по токену активации
    static async getUserByActivationToken(activationToken) {
        try {
            const user = await User.findOne({ where: { activationToken } });
            if (!user) {
                return null;
            }
            return user.get();
        } catch (error) {
            return error.message;
        }
    }

    // Активировать пользователя
    static async activateUser(id) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return null;
            }

            // Активируем аккаунт и удаляем токен активации
            user.isActivated = true;
            user.activationToken = null;
            await user.save();

            const activatedUser = user.get();
            delete activatedUser.password;
            delete activatedUser.activationToken;
            return activatedUser;
        } catch (error) {
            return error.message;
        }
    }
}

module.exports = UserService;