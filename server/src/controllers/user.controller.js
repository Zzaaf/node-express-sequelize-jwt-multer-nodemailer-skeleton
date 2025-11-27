const { User } = require('../db/models');
const UserService = require('../services/user.service');
const formatResponse = require('../utils/formatResponse');
const generateJWTTokens = require('../utils/generateJWTTokens');
const jwt = require('jsonwebtoken');
const cookieConfig = require('../config/cookieConfig');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mailService = require('../services/mail.service');

class UserController {

    // Обновление токенов
    static async refreshTokens(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const { user } = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateJWTTokens({ user });

            return res
                .status(200)
                .cookie('refreshToken', newRefreshToken, cookieConfig)
                .json(formatResponse(200, 'User session successfully extended', { user, accessToken: newAccessToken }));
        } catch ({ message }) {
            res
                .status(401)
                .clearCookie('refreshToken')
                .json(formatResponse(401, 'Invalid refresh token', null, message));
        }
    }

    // Формирования ответа с массивом всех пользователей
    static async getAllUsers(req, res) {
        try {
            const allUsers = await UserService.getAllUsersWithoutMeta();
            res.json(formatResponse(200, 'All users', allUsers))
        } catch (error) {
            res.status(400).json(formatResponse(400, error.message, null, error))
        }
    }

    // Регистрация
    static async signUp(req, res) {
        const { email, name, password } = req.body;
        const { isValid, error } = User.validateSignUpData({ email, name, password });

        if (!isValid) {
            return res
                .status(400)
                .json(formatResponse(400, 'Validation error', null, error));
        }

        try {
            const userFound = await UserService.getByEmail(email.toLowerCase());

            if (userFound) {
                return res
                    .status(400)
                    .json(formatResponse(400, 'User with this email already exists', null, 'User with this email already exists'));
            }

            // Генерируем уникальный токен активации
            const activationToken = uuidv4();

            // Создаём пользователя с токеном активации
            const newUser = await UserService.createUser({ 
                email, 
                name, 
                password, 
                activationToken 
            });

            if (!newUser) {
                return res
                    .status(500)
                    .json(formatResponse(500, 'Failed to create new user', null, 'Failed to create new user'));
            }

            // Отправляем письмо с активацией
            try {
                await mailService.sendActivationMail(newUser.email, newUser.name, activationToken);
            } catch (mailError) {
                console.error('Failed to send activation email:', mailError.message);
                // Не блокируем регистрацию, если не удалось отправить письмо
            }

            // Возвращаем успешный ответ БЕЗ токенов (пользователь должен сначала активировать аккаунт)
            return res
                .status(201)
                .json(formatResponse(201, 'Registration successful! Please check your email to activate your account.', { 
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        isActivated: newUser.isActivated
                    }
                }));
        } catch ({ message }) {
            return res
                .status(500)
                .json(formatResponse(500, 'Internal server error', null, message));
        }
    }

    // Авторизация
    static async signIn(req, res) {
        const { email, password } = req.body;
        const { isValid, error } = User.validateSignInData({ email, password });

        if (!isValid) {
            return res
                .status(400)
                .json(formatResponse(400, 'Validation error', null, error));
        }

        try {
            const userFound = await UserService.getByEmail(email.toLowerCase());

            if (!userFound) {
                return res
                    .status(400)
                    .json(formatResponse(400, 'User with this email not found', null, 'User with this email not found'));
            }

            // Проверяем, активирован ли аккаунт
            if (!userFound.isActivated) {
                return res
                    .status(403)
                    .json(formatResponse(403, 'Account is not activated', null, 'Please check your email and activate your account'));
            }

            const isPasswordValid = await bcrypt.compare(password, userFound.password);
            delete userFound.password;
            delete userFound.activationToken; // Удаляем токен из ответа

            if (!isPasswordValid) {
                return res
                    .status(400)
                    .json(formatResponse(400, 'Invalid password', null, 'Invalid password'));
            }

            const { accessToken, refreshToken } = generateJWTTokens({ user: userFound });

            return res
                .status(200)
                .cookie('refreshToken', refreshToken, cookieConfig)
                .json(formatResponse(200, 'Sign in successful', { user: userFound, accessToken }));
        } catch ({ message }) {
            return res
                .status(500)
                .json(formatResponse(500, 'Internal server error', null, message));
        }
    }

    // Активация аккаунта
    static async activateAccount(req, res) {
        try {
            const { token } = req.params;

            if (!token) {
                return res
                    .status(400)
                    .json(formatResponse(400, 'Activation token is required', null, 'Token is missing'));
            }

            // Ищем пользователя по токену активации
            const user = await UserService.getUserByActivationToken(token);

            if (!user) {
                return res
                    .status(404)
                    .json(formatResponse(404, 'Invalid or expired activation token', null, 'Token not found'));
            }

            // Проверяем, не активирован ли уже аккаунт
            if (user.isActivated) {
                return res
                    .status(400)
                    .json(formatResponse(400, 'Account is already activated', null, 'Already activated'));
            }

            // Активируем аккаунт
            const activatedUser = await UserService.activateUser(user.id);

            if (!activatedUser) {
                return res
                    .status(500)
                    .json(formatResponse(500, 'Failed to activate account', null, 'Activation failed'));
            }

            // Генерируем токены для автоматического входа после активации
            const { accessToken, refreshToken } = generateJWTTokens({ user: activatedUser });

            return res
                .status(200)
                .cookie('refreshToken', refreshToken, cookieConfig)
                .json(formatResponse(200, 'Account activated successfully! You are now logged in.', { 
                    user: activatedUser, 
                    accessToken 
                }));
        } catch ({ message }) {
            return res
                .status(500)
                .json(formatResponse(500, 'Internal server error', null, message));
        }
    }

    // Выход
    static signOut(req, res) {
        try {
            res
                .clearCookie('refreshToken')
                .json(formatResponse(200, 'Sign out successful'));
        } catch ({ message }) {
            res
                .status(500)
                .json(formatResponse(500, 'Internal server error', null, message));
        }
    }

    // Получение объекта пользователя по ID
    static async getUserById(req, res) {
        try {
            const { id } = req.params
            const user = await UserService.getUserById(id)
            res.json(formatResponse(200, 'User', user))
        } catch (error) {
            res.status(400).json(formatResponse(400, error.message, null, error))
        }
    }

    // Удаление пользователя из приложения
    static async deleteUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.deleteUserById(id);

            if (!user) {
                res.status(404).json(formatResponse(404, 'Not found user'))
            } else {
                res.json(formatResponse(200, 'User', user))
            }
        } catch (error) {
            res.status(400).json(formatResponse(400, error.message, null, error));
        }
    }

    // Обновление профиля пользователя (имя и email)
    static async updateUserProfile(req, res) {
        try {
            const { id } = req.params;
            const { name, email } = req.body;

            // Проверка, что хотя бы одно поле передано
            if (!name && !email) {
                return res.status(400).json(
                    formatResponse(400, 'At least one field (name or email) is required', null, 'No fields to update')
                );
            }

            // Валидация email если он передан
            if (email && !User.validateEmail(email)) {
                return res.status(400).json(
                    formatResponse(400, 'Invalid email format', null, 'Invalid email')
                );
            }

            // Проверка на уникальность email если он передан
            if (email) {
                const existingUser = await UserService.getByEmail(email.toLowerCase());
                // Проверяем: если пользователь найден И это не тот же пользователь
                if (existingUser && typeof existingUser === 'object' && existingUser.id !== parseInt(id)) {
                    return res.status(400).json(
                        formatResponse(400, 'Email already in use', null, 'Email already exists')
                    );
                }
            }

            const updatedUser = await UserService.updateUser(id, { name, email });

            if (!updatedUser) {
                return res.status(404).json(formatResponse(404, 'User not found'));
            }

            // Генерируем новые токены с обновлёнными данными
            const { accessToken, refreshToken } = generateJWTTokens({ user: updatedUser });

            return res
                .status(200)
                .cookie('refreshToken', refreshToken, cookieConfig)
                .json(formatResponse(200, 'Profile updated successfully', { user: updatedUser, accessToken }));
        } catch (error) {
            res.status(500).json(formatResponse(500, 'Internal server error', null, error.message));
        }
    }

    // Загрузка аватара пользователя
    static async uploadAvatar(req, res) {
        try {
            const { id } = req.params;

            if (!req.file) {
                return res.status(400).json(
                    formatResponse(400, 'No file uploaded', null, 'File is required')
                );
            }

            // Получаем текущего пользователя для удаления старого аватара
            const currentUser = await UserService.getUserById(id);

            // Если у пользователя уже есть аватар, удаляем старый файл
            if (currentUser && currentUser.avatar) {
                const oldAvatarPath = path.join(__dirname, '..', currentUser.avatar);
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath);
                }
            }

            // Сохраняем относительный путь к файлу
            const avatarPath = `/uploads/${req.file.filename}`;
            const updatedUser = await UserService.updateAvatar(id, avatarPath);

            if (!updatedUser) {
                return res.status(404).json(formatResponse(404, 'User not found'));
            }

            // Генерируем новые токены с обновлённым аватаром
            const { accessToken, refreshToken } = generateJWTTokens({ user: updatedUser });

            return res
                .status(200)
                .cookie('refreshToken', refreshToken, cookieConfig)
                .json(formatResponse(200, 'Avatar uploaded successfully', { user: updatedUser, accessToken }));
        } catch (error) {
            // Если произошла ошибка, удаляем загруженный файл
            if (req.file) {
                const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            res.status(500).json(formatResponse(500, 'Internal server error', null, error.message));
        }
    }
}

module.exports = UserController;