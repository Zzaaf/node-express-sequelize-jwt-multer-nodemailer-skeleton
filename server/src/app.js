require('dotenv').config();
const express = require('express');
const serverConfig = require('./config/serverConfig');
const mainRoutes = require('./routes/main.routes');
const path = require('path');

// Формирование экземпляра сервера
const app = express();

// Определение порта
const PORT = process.env.PORT || 4000;

// Запуск конфигурации
serverConfig(app);

// Маршрутизация
app.use('/', mainRoutes);

// Маршрутизация для SPA (catch-all)
app.get(/.*/, (req, res) => {
    const indexPath = process.env.NODE_ENV === 'production'
        ? path.join(__dirname, '../../..', 'client', 'dist', 'index.html')
        : path.join(__dirname, 'public', 'index.html');
    res.sendFile(indexPath);
});

// "Слушаем" порт
app.listen(PORT, () => console.log(`Server started at ${PORT} port`));