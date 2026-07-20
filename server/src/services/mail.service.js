const transporter = require('../config/mailConfig');

class MailService {
    /**
     * Отправка письма с активацией аккаунта
     * @param {string} to - email получателя
     * @param {string} name - имя пользователя
     * @param {string} activationToken - токен активации
     */
    async sendActivationMail(to, name, activationToken) {
        const activationLink = `${process.env.CLIENT_URL}/activate/${activationToken}`;

        const mailOptions = {
            from: `"${process.env.SMTP_FROM_NAME || 'JWT Demo Skeleton'}" <${process.env.SMTP_USER}>`,
            to,
            subject: 'Account Activation - JWT Demo Skeleton',
            html: this.getActivationEmailTemplate(name, activationLink),
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ Activation email sent to ${to}:`, info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(`❌ Error sending email to ${to}:`, error.message);
            throw error;
        }
    }

    /**
     * HTML шаблон письма активации
     * @param {string} name - имя пользователя
     * @param {string} activationLink - ссылка активации
     * @returns {string} HTML шаблон
     */
    getActivationEmailTemplate(name, activationLink) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Activation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #111827;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .activate-button {
            display: inline-block;
            padding: 14px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s;
        }
        .activate-button:hover {
            transform: translateY(-2px);
        }
        .alternative-link {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
        .alternative-link p {
            margin: 10px 0;
        }
        .link-text {
            word-break: break-all;
            color: #667eea;
            text-decoration: none;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
        }
        .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin-top: 30px;
            border-radius: 4px;
        }
        .warning p {
            margin: 0;
            font-size: 14px;
            color: #92400e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome!</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello, ${name}!
            </div>
            
            <div class="message">
                Thank you for registering with <strong>JWT Demo Skeleton</strong>! 
                We're excited to have you in our community.
            </div>
            
            <div class="message">
                To start using all the features of the application, 
                you need to activate your account. 
                Simply click the button below:
            </div>
            
            <div class="button-container">
                <a href="${activationLink}" class="activate-button">
                    ✨ Activate Account
                </a>
            </div>
            
            <div class="alternative-link">
                <p><strong>Link not working?</strong></p>
                <p>Copy and paste this link into your browser's address bar:</p>
                <p><a href="${activationLink}" class="link-text">${activationLink}</a></p>
            </div>
            
            <div class="warning">
                <p>
                    ⚠️ <strong>Important:</strong> This link is valid for 24 hours. 
                    If you didn't register for our application, please ignore this email.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>JWT Demo Skeleton</strong></p>
            <p>Modern Authentication System</p>
            <p style="margin-top: 15px; color: #9ca3af;">
                This is an automated email, please do not reply.
            </p>
        </div>
    </div>
</body>
</html>
        `;
    }

    /**
     * Отправка тестового письма (для проверки настроек)
     * @param {string} to - email получателя
     */
    async sendTestMail(to) {
        const mailOptions = {
            from: `"${process.env.SMTP_FROM_NAME || 'JWT Demo Skeleton'}" <${process.env.SMTP_USER}>`,
            to,
            subject: 'Test Email - JWT Demo Skeleton',
            html: `<h2>Test Successful! ✅</h2><p>Email settings are working correctly.</p>`,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ Test email sent to ${to}:`, info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(`❌ Error sending test email to ${to}:`, error.message);
            throw error;
        }
    }
}

module.exports = new MailService();

