const nodemailer = require('nodemailer');

// Конфигурация транспорта для отправки писем
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true для 465, false для других портов
    auth: {
        user: process.env.SMTP_USER, // ваш email
        pass: process.env.SMTP_PASSWORD // пароль приложения
    }
});

// Проверка подключения при запуске
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP connection error:', error.message);
    } else {
        console.log('✅ SMTP server is ready to send emails');
    }
});

module.exports = transporter;

