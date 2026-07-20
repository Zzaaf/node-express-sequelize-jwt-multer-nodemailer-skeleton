const nodemailer = require('nodemailer');

const port = parseInt(process.env.SMTP_PORT) || 465;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.yandex.ru',
    port,
    secure: port === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

transporter.verify((error) => {
    if (error) {
        console.error('❌ SMTP connection error:', error.message);
    } else {
        console.log('✅ SMTP server is ready to send emails');
    }
});

module.exports = transporter;
