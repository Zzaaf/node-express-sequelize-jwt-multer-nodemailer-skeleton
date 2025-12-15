const rateLimit = require('express-rate-limit');
const formatResponse = require('../utils/formatResponse');

/**
 * Общий лимит для всех запросов
 * 100 запросов за 15 минут с одного IP
 */
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум запросов за окно
    message: formatResponse(429, 'Too many requests', null, 'Please try again later'),
    standardHeaders: true, // Возвращает заголовки RateLimit-*
    legacyHeaders: false, // Отключает X-RateLimit-* заголовки
    handler: (req, res) => {
        res.status(429).json(
            formatResponse(429, 'Too many requests', null, 'Please try again later')
        );
    },
});

/**
 * Строгий лимит для аутентификации
 * 5 попыток за 15 минут (защита от brute-force)
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 5, // максимум 5 попыток
    message: formatResponse(429, 'Too many login attempts', null, 'Please try again after 15 minutes'),
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Не считать успешные запросы
    handler: (req, res) => {
        res.status(429).json(
            formatResponse(429, 'Too many login attempts', null, 'Please try again after 15 minutes')
        );
    },
});

/**
 * Лимит для регистрации
 * 3 регистрации за час с одного IP
 */
const signUpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 час
    max: 3, // максимум 3 регистрации
    message: formatResponse(429, 'Too many accounts created', null, 'Please try again after an hour'),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json(
            formatResponse(429, 'Too many accounts created', null, 'Please try again after an hour')
        );
    },
});

/**
 * Лимит для API запросов
 * 60 запросов в минуту
 */
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 минута
    max: 60, // максимум 60 запросов
    message: formatResponse(429, 'API rate limit exceeded', null, 'Please slow down'),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json(
            formatResponse(429, 'API rate limit exceeded', null, 'Please slow down')
        );
    },
});

module.exports = {
    globalLimiter,
    authLimiter,
    signUpLimiter,
    apiLimiter,
};

