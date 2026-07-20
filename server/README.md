# Server (Backend)

Node.js + Express 5 REST API с JWT-аутентификацией, управлением пользователями и задачами.

## Технологии

| Пакет | Версия | Назначение |
|-------|--------|-----------|
| express | 5.1.0 | HTTP-фреймворк |
| sequelize | 6.37.7 | ORM для PostgreSQL |
| pg / pg-hstore | 8.x | PostgreSQL-адаптер |
| jsonwebtoken | 9.0.2 | Access / Refresh JWT токены |
| bcrypt | 6.0.0 | Хеширование паролей (10 раундов) |
| nodemailer | 7.x | Отправка email (активация аккаунта) |
| multer | 2.0.2 | Загрузка файлов (аватары) |
| helmet | 8.1.0 | Security HTTP-заголовки |
| express-rate-limit | 8.2.1 | Защита от DDoS / brute-force |
| cors | 2.8.5 | Cross-Origin Resource Sharing |
| cookie-parser | 1.4.7 | Чтение httpOnly cookies |
| morgan | 1.10.1 | HTTP-логирование (Combined) |
| uuid | 13.x | Генерация токенов активации |
| dotenv | 17.x | Переменные окружения |

## Архитектура (MVC)

```
server/src/
├── app.js                        # Точка входа, SPA catch-all
├── config/
│   ├── serverConfig.js           # Express, CORS, static, middleware
│   ├── cookieConfig.js           # Параметры httpOnly cookie
│   ├── jwtConfig.js              # Время жизни токенов
│   ├── mailConfig.js             # Nodemailer транспорт
│   ├── uploadConfig.js           # Multer (тип, размер, путь)
│   ├── helmetConfig.js           # Настройки Helmet
│   └── rateLimitConfig.js        # Rate-limit лимиты
├── controllers/
│   ├── user.controller.js        # Auth + пользователи
│   └── task.controller.js        # Задачи
├── services/
│   ├── user.service.js           # Бизнес-логика пользователей
│   ├── task.service.js           # Бизнес-логика задач
│   └── mail.service.js           # Отправка email
├── routes/
│   ├── main.routes.js            # / → api.routes
│   ├── api.routes.js             # /api → auth / users / tasks
│   ├── auth.routes.js
│   ├── users.routes.js
│   └── tasks.routes.js
├── middleware/
│   ├── verifyAccessToken.js      # Проверка Authorization header
│   ├── verifyRefreshToken.js     # Проверка refresh cookie
│   ├── verifyTaskOwner.js        # Проверка владения задачей
│   └── removeHttpHeader.js       # Удаление X-Powered-By
├── db/
│   ├── models/
│   │   ├── index.js              # Инициализация Sequelize
│   │   ├── user.js               # Модель User
│   │   └── task.js               # Модель Task
│   ├── migrations/
│   │   ├── 20251117090234-create-user.js
│   │   ├── 20251118071659-create-task.js
│   │   ├── 20251126161851-add-avatar-to-users.js
│   │   └── 20251126181046-add-activation-fields-to-users.js
│   └── config/
│       └── database.json         # Конфигурация Sequelize CLI
├── utils/
│   ├── formatResponse.js         # Унифицированный формат ответов
│   └── generateJWTTokens.js      # Генерация пары токенов
├── logs/                         # Создаётся автоматически
└── uploads/                      # Аватары пользователей
```

## Установка и запуск (локально)

```bash
# Установка зависимостей
cd server
npm install

# Создать .env (см. ниже)

# Создать БД и применить миграции
npm run db:create
npm run db:migrate

# Dev-режим (с --watch)
npm run dev

# Production-запуск
npm start
```

## Переменные окружения

Создайте файл `.env` в папке `server`:

```env
# Сервер
PORT=4000
NODE_ENV=development

# URL клиента для CORS (несколько через запятую)
CLIENT_URL=http://localhost:5173

# PostgreSQL
DB_NAME=jwt_demo_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

# JWT (смените на длинные случайные строки в production!)
SECRET_ACCESS_TOKEN=your_secret_access_token
SECRET_REFRESH_TOKEN=your_secret_refresh_token

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_NAME=JWT Auth Skeleton
```

> **Production:** установите `NODE_ENV=production`, `CLIENT_URL` — URL вашего фронтенда на Render.

## Переменные окружения Render.com

При деплое на Render добавьте в Web Service → Environment:

| Переменная | Значение |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | задаётся автоматически |
| `CLIENT_URL` | URL вашего фронтенда (или того же сервиса) |
| `DB_*` | данные вашей PostgreSQL БД на Render |
| `SECRET_ACCESS_TOKEN` | длинная случайная строка |
| `SECRET_REFRESH_TOKEN` | длинная случайная строка |
| `SMTP_*` | ваши SMTP-настройки |

## API Endpoints

Базовый путь: `/api`

### Auth (`/api/auth`)

| Метод | Endpoint | Описание | Защита |
|-------|----------|----------|--------|
| POST | `/signUp` | Регистрация + письмо активации | — |
| GET | `/activate/:token` | Активация аккаунта | — |
| POST | `/signIn` | Вход (только активированные) | — |
| GET | `/refreshTokens` | Обновление токенов | refresh cookie |
| DELETE | `/signOut` | Выход, очистка cookie | — |

**Поток регистрации:**
1. `POST /signUp` → аккаунт создан (`isActivated: false`), письмо отправлено
2. Пользователь кликает ссылку в письме → `GET /activate/:token`
3. Аккаунт активируется, возвращаются токены, пользователь входит

### Users (`/api/users`)

| Метод | Endpoint | Описание | Защита |
|-------|----------|----------|--------|
| GET | `/` | Все пользователи | — |
| GET | `/:id` | Пользователь по ID | — |
| PUT | `/:id` | Обновить профиль | verifyAccessToken |
| PUT | `/:id/avatar` | Загрузить аватар | verifyAccessToken |
| DELETE | `/:id` | Удалить пользователя | — |

### Tasks (`/api/tasks`)

| Метод | Endpoint | Описание | Защита |
|-------|----------|----------|--------|
| GET | `/` | Все задачи | — |
| GET | `/user/:userId` | Задачи пользователя | — |
| GET | `/:id` | Задача по ID | — |
| POST | `/` | Создать задачу | verifyAccessToken |
| PUT | `/:id` | Обновить задачу | verifyAccessToken + verifyTaskOwner |
| DELETE | `/:id` | Удалить задачу | verifyAccessToken + verifyTaskOwner |

## Формат ответов

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": { },
  "error": null
}
```

## База данных

### Модель User
```
id, name, email, password (bcrypt), avatar, isActivated, activationToken, createdAt, updatedAt
```
- Hooks: `beforeCreate` — хеширует пароль, нормализует email/name
- Методы: `validateEmail`, `validatePassword`, `validateSignInData`, `validateSignUpData`

### Модель Task
```
id, title, status (boolean), user_id (FK), createdAt, updatedAt
```

### Команды Sequelize

```bash
npm run db:create    # Создать БД
npm run db:migrate   # Сбросить и применить все миграции
npm run db:drop      # Удалить БД

# Откат вручную
npx sequelize db:migrate:undo
npx sequelize db:migrate:undo:all
```

## Безопасность

| Механизм | Описание |
|----------|----------|
| **Helmet** | CSP, HSTS, X-Frame-Options и другие security-заголовки |
| **Rate Limiting** | Глобальный лимит запросов (express-rate-limit) |
| **bcrypt** | Хеширование паролей, 10 раундов |
| **JWT** | Access (3 мин, в памяти) + Refresh (24 ч, httpOnly cookie) |
| **CORS** | Разрешены только origin из `CLIENT_URL` |
| **verifyTaskOwner** | Проверка владения ресурсом перед изменением |
| **Multer** | Проверка MIME-типа и размера (≤ 1 МБ) |

## Логирование

- Morgan (Combined-формат) → файл `src/logs/access_ДД.ММ.ГГГГ.log`
- Папка `logs/` создаётся автоматически при старте
- Ротация по дням (новый файл каждый день)

## Загрузка файлов

- Путь хранения: `src/uploads/`
- Имя файла: `avatar-[timestamp]-[random].[ext]`
- Раздача: `/uploads/*` → `src/uploads/`
- Форматы: JPEG, PNG, GIF, WEBP
- Максимальный размер: 1 МБ
