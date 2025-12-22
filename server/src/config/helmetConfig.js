/**
 * Конфигурация Helmet — middleware для установки security HTTP заголовков
 * 
 * Helmet защищает от:
 * - XSS атак (Cross-Site Scripting)
 * - Clickjacking (встраивание сайта в iframe)
 * - MIME sniffing (подмена типа контента)
 * - И других распространённых веб-уязвимостей
 */

const helmetConfig = {
    /**
     * Content-Security-Policy (CSP)
     * Определяет откуда можно загружать ресурсы (скрипты, стили, изображения)
     * Это основная защита от XSS атак
     */
    contentSecurityPolicy: {
        directives: {
            // Базовый источник для всех ресурсов — только свой домен
            defaultSrc: ["'self'"],

            // Скрипты: свой домен + inline скрипты (для React/SPA)
            // 'unsafe-inline' нужен для некоторых SPA, но снижает безопасность
            scriptSrc: ["'self'", "'unsafe-inline'"],

            // Стили: свой домен + inline стили + Google Fonts
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],

            // Шрифты: свой домен + Google Fonts CDN
            fontSrc: ["'self'", "https://fonts.gstatic.com"],

            // Изображения: свой домен + data URIs (для base64) + blob (для превью)
            imgSrc: ["'self'", "data:", "blob:"],

            // Подключения (fetch, XHR, WebSocket): свой домен
            connectSrc: ["'self'"],

            // Фреймы: запрещены (защита от clickjacking через CSP)
            frameSrc: ["'none'"],

            // Объекты (Flash, Java applets): запрещены
            objectSrc: ["'none'"],

            // Базовый URI для относительных ссылок
            baseUri: ["'self'"],

            // Откуда можно отправлять формы
            formAction: ["'self'"],
        },
    },

    /**
     * X-Frame-Options
     * Защита от Clickjacking — запрещает встраивание сайта в iframe
     * DENY — полный запрет, SAMEORIGIN — разрешить только своему домену
     */
    frameguard: {
        action: 'deny', // Полностью запретить iframe
    },

    /**
     * X-Content-Type-Options: nosniff
     * Запрещает браузеру "угадывать" MIME тип файла
     * Защита от атак через подмену типа контента
     */
    noSniff: true,

    /**
     * X-XSS-Protection
     * Включает встроенную защиту браузера от XSS (устарело, но не вредит)
     * Современные браузеры полагаются на CSP, но это дополнительный слой
     */
    xssFilter: true,

    /**
     * Referrer-Policy
     * Контролирует какую информацию передавать в заголовке Referer
     * 'strict-origin-when-cross-origin' — безопасный баланс приватности и функциональности
     */
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
    },

    /**
     * Strict-Transport-Security (HSTS)
     * Принуждает браузер использовать только HTTPS
     * maxAge — время в секундах (1 год = 31536000)
     * 
     * ⚠️ ВАЖНО: Включать только если сайт работает по HTTPS!
     * В development можно отключить
     */
    hsts: {
        maxAge: 31536000, // 1 год
        includeSubDomains: true, // Применить ко всем поддоменам
        preload: false, // true только если добавили домен в HSTS preload list
    },

    /**
     * X-DNS-Prefetch-Control
     * Контролирует предварительное разрешение DNS
     * off — отключить для приватности, on — включить для производительности
     */
    dnsPrefetchControl: {
        allow: false, // Приватность важнее
    },

    /**
     * X-Permitted-Cross-Domain-Policies
     * Ограничивает Adobe Flash и PDF от чтения данных с сайта
     * 'none' — полный запрет (Flash уже не актуален, но не мешает)
     */
    permittedCrossDomainPolicies: {
        permittedPolicies: 'none',
    },

    /**
     * X-Download-Options (только IE)
     * Запрещает IE открывать загруженные файлы напрямую
     * Защита от выполнения вредоносного кода в контексте сайта
     */
    ieNoOpen: true,

    /**
     * Origin-Agent-Cluster
     * Изолирует origin в отдельный процесс (современные браузеры)
     * Дополнительная защита от Spectre-подобных атак
     */
    originAgentCluster: true,

    /**
     * Cross-Origin-Resource-Policy
     * Контролирует какие origins могут загружать ресурсы (изображения, скрипты)
     * 
     * Значения:
     * - 'same-origin' — только свой origin (строго)
     * - 'same-site' — тот же сайт (включая поддомены)
     * - 'cross-origin' — любой origin (для публичных ресурсов)
     * 
     * ⚠️ Для работы аватарок между frontend (5173) и backend (3000) нужен 'cross-origin'
     */
    crossOriginResourcePolicy: {
        policy: 'cross-origin',
    },

    /**
     * Cross-Origin-Embedder-Policy
     * Требует чтобы все загружаемые ресурсы имели CORP заголовки
     * 
     * false — отключить (нужно для загрузки изображений с других origins)
     * Включение блокирует ресурсы без явного Cross-Origin-Resource-Policy
     */
    crossOriginEmbedderPolicy: false,
};

/**
 * Конфигурация для development окружения
 * Менее строгая CSP для удобства разработки
 */
const helmetConfigDev = {
    ...helmetConfig,
    contentSecurityPolicy: {
        directives: {
            ...helmetConfig.contentSecurityPolicy.directives,
            // В dev разрешаем localhost для hot reload
            connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"],
            // Разрешаем eval для source maps
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            // Разрешаем изображения с localhost (разные порты)
            imgSrc: ["'self'", "data:", "blob:", "http://localhost:*"],
        },
    },
    // Отключаем HSTS в development (нет HTTPS)
    hsts: false,
};

/**
 * Возвращает конфигурацию в зависимости от окружения
 */
const getHelmetConfig = () => {
    const isDev = process.env.NODE_ENV !== 'production';
    return isDev ? helmetConfigDev : helmetConfig;
};

module.exports = { helmetConfig, helmetConfigDev, getHelmetConfig };

