const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { globalLimiter } = require('./rateLimitConfig');
const { getHelmetConfig } = require('./helmetConfig');

// Проверка наличия папки logs
if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'logs'));
}

// Создание стрима записи логов
const accessLogStream = fs.createWriteStream(path.join(__dirname, '..', 'logs', `access_${new Date().toLocaleDateString('ru-RU')}.log`), { flags: 'a' })

// Создание конфигурации CORS политики
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(o => o.trim())
    : ['http://localhost:5173'];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true, // Важно для работы с cookies
};

// Определяем конфигурацию всего сервера
const serverConfig = (app) => {
    // Helmet - установка security HTTP заголовков (должен быть первым)
    // Защита от XSS, clickjacking, MIME sniffing и др.
    // Также автоматически удаляет X-Powered-By
    app.use(helmet(getHelmetConfig()));

    // Rate limiting - защита от DDoS и brute-force атак
    app.use(globalLimiter);

    // CORS - разрешаем запросы с указанных доменов
    app.use(cors(corsOptions));

    // Парсим данные из формы
    app.use(express.urlencoded({ extended: true }));

    // Парсим данные формата JSON
    app.use(express.json());

    // Настройка статики — в production раздаём сборку React-клиента
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../../..', 'client', 'dist')));
    } else {
        app.use(express.static(path.join(__dirname, '../public')));
    }

    // Раздача загруженных файлов (аватары)
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // Установка логирования
    app.use(morgan('combined', { stream: accessLogStream }));

    // Парсинг кук со стороны клиента
    app.use(cookieParser());
}

module.exports = serverConfig;