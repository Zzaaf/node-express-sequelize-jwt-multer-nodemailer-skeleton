# Server (Backend)

Node.js + Express API с JWT аутентификацией, управлением пользователями и задачами.

## Технологии

- **Node.js + Express 5.1.0** - серверный фреймворк
- **PostgreSQL + Sequelize 6.37.7** - база данных и ORM
- **JWT (jsonwebtoken 9.0.2)** - токены для аутентификации
- **bcrypt 6.0.0** - хеширование паролей (10 раундов)
- **Nodemailer (latest)** - отправка email (активация аккаунта)
- **UUID v4** - генерация уникальных токенов активации
- **Multer 2.0.2** - загрузка файлов (аватары)
- **Morgan 1.10.1** - логирование HTTP запросов
- **Cookie-parser 1.4.7** - работа с cookies
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **dotenv 17.2.3** - переменные окружения

## Архитектура

Проект следует **MVC** паттерну с разделением на слои:

```
src/
├── app.js            # Точка входа приложения
├── config/           # Конфигурации
│   ├── serverConfig.js   # Express и middleware
│   ├── cookieConfig.js   # Настройки cookies
│   ├── jwtConfig.js      # Время жизни токенов
│   ├── mailConfig.js     # Nodemailer для email
│   └── uploadConfig.js   # Multer для загрузки файлов
├── controllers/      # Контроллеры (обработка запросов)
│   ├── user.controller.js  # Auth и пользователи
│   └── task.controller.js  # Задачи
├── services/         # Сервисы (бизнес-логика)
│   ├── user.service.js     # Логика пользователей
│   ├── task.service.js     # Логика задач
│   └── mail.service.js     # Отправка email
├── routes/           # Маршруты API
│   ├── api.routes.js       # Главный API роутер
│   ├── auth.routes.js      # Аутентификация
│   ├── users.routes.js     # Пользователи
│   ├── tasks.routes.js     # Задачи
│   ├── static.routes.js    # Статические файлы
│   └── main.routes.js      # Главный роутер
├── middleware/       # Middleware
│   ├── verifyAccessToken.js   # Проверка access token
│   ├── verifyRefreshToken.js  # Проверка refresh token
│   ├── verifyTaskOwner.js     # Проверка владения задачей
│   └── removeHttpHeader.js    # Удаление X-Powered-By
├── db/               # База данных
│   ├── models/       # Модели Sequelize
│   │   ├── index.js  # Инициализация моделей
│   │   ├── user.js   # Модель User
│   │   └── task.js   # Модель Task
│   ├── migrations/   # Миграции БД
│   │   ├── 20251117090234-create-user.js
│   │   ├── 20251118071659-create-task.js
│   │   └── 20251126161851-add-avatar-to-users.js
│   └── config/
│       └── database.json  # Конфигурация БД
├── utils/            # Утилиты
│   ├── formatResponse.js      # Форматирование ответов
│   └── generateJWTTokens.js   # Генерация токенов
├── logs/             # Логи (создаются автоматически)
├── uploads/          # Загруженные файлы (аватары)
└── public/           # Статические файлы
    ├── index.html
    ├── css/
    └── js/
```

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Создать .env файл (см. ниже)

# Создать базу данных
npm run db:create

# Запустить миграции
npm run db:migrate

# Запуск с hot-reload
npm run dev

# Обычный запуск
npm start
```

## Переменные окружения

Создайте файл `.env` в корне папки `server`:

```env
# Сервер
PORT=4000
NODE_ENV=development

# URL клиента (для CORS)
CLIENT_URL=http://localhost:5173

# База данных PostgreSQL
DB_NAME=jwt_demo_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

# JWT секретные ключи (измените в production!)
SECRET_ACCESS_TOKEN=your_secret_access_token_key_change_in_production
SECRET_REFRESH_TOKEN=your_secret_refresh_token_key_change_in_production

# SMTP конфигурация для отправки писем
# Для Gmail используйте App Password (не обычный пароль):
# 1. Включите двухфакторную аутентификацию
# 2. Перейдите: https://myaccount.google.com/apppasswords
# 3. Создайте App Password для приложения
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here
SMTP_FROM_NAME=JWT Demo Skeleton
```

> **⚠️ Важно:** 
> - В production обязательно смените секретные ключи на длинные случайные строки!
> - Для Gmail используйте App Password, а не обычный пароль аккаунта

## Дополнительные возможности

### Email-уведомления (Nodemailer)
- **Транспорт:** SMTP (Gmail, Yandex, custom)
- **Порт:** 587 (TLS) или 465 (SSL)
- **Активация аккаунта:** 
  - Генерация уникального токена (UUID v4)
  - Красивое HTML письмо с градиентами
  - Ссылка активации: `CLIENT_URL/activate/:token`
  - Токен хранится в БД до активации
- **Шаблон письма:**
  - Приветствие с именем пользователя
  - Кнопка активации
  - Альтернативная ссылка (если кнопка не работает)
  - Предупреждение о безопасности
  - Адаптивный дизайн
- **Проверка подключения:** при запуске сервера
- **Логирование:** успешные/неудачные отправки

**Для Gmail:**
1. Включите двухфакторную аутентификацию
2. Создайте App Password: https://myaccount.google.com/apppasswords
3. Используйте App Password в `SMTP_PASSWORD`

### Загрузка файлов (Multer)
- **Путь хранения:** `src/uploads/`
- **Максимальный размер:** 1 МБ
- **Разрешенные форматы:** JPEG, JPG, PNG, GIF, WEBP
- **Имя файла:** `avatar-[timestamp]-[random].[ext]`
- **Проверка типов:** через `mimetype`
- **Статическая раздача:** `/uploads` -> `src/uploads/`

### Статические файлы
- **Путь:** `src/public/`
- **Раздача:** `/` -> `src/public/index.html`
- **Включает:** Bootstrap CSS/JS

### Формат ответов
Все API ответы унифицированы через `formatResponse()`:

```javascript
{
  status: 200,           // HTTP статус
  message: "Success",    // Сообщение
  data: { ... },         // Данные (или null)
  error: null            // Ошибка (или null)
}
```

## API Endpoints

Базовый путь: `/api`

### Authentication (`/api/auth`)

| Метод | Endpoint | Описание | Защита | Body/Params |
|-------|----------|----------|--------|-------------|
| POST | `/signUp` | Регистрация нового пользователя (отправка email) | - | `{ name, email, password }` |
| GET | `/activate/:token` | Активация аккаунта по токену из email | - | `token` в URL |
| POST | `/signIn` | Вход в систему | - | `{ email, password }` |
| GET | `/refreshTokens` | Обновление access и refresh токенов | refresh token (cookie) | - |
| DELETE | `/signOut` | Выход из системы | - | - |

**Процесс регистрации:**
1. Пользователь отправляет данные на `/signUp`
2. Создаётся неактивированный аккаунт с уникальным токеном
3. На email отправляется письмо со ссылкой активации
4. Пользователь переходит по ссылке `/activate/:token`
5. Аккаунт активируется, пользователь автоматически входит

**Ответ при signUp (БЕЗ токенов):**
```json
{
  "status": 201,
  "message": "Registration successful! Please check your email to activate your account.",
  "data": {
    "user": {
      "id": 1,
      "name": "...",
      "email": "...",
      "isActivated": false
    }
  }
}
```

**Ответ при signIn (только для активированных):**
```json
{
  "status": 200,
  "message": "Sign in successful",
  "data": {
    "user": { "id": 1, "name": "...", "email": "...", "avatar": "...", "isActivated": true },
    "accessToken": "..."
  }
}
```

**Ошибка при входе без активации:**
```json
{
  "status": 403,
  "message": "Account is not activated",
  "error": "Please check your email and activate your account"
}
```

### Users (`/api/users`)

| Метод | Endpoint | Описание | Защита | Body/Params |
|-------|----------|----------|--------|-------------|
| GET | `/` | Получить всех пользователей | - | - |
| GET | `/:id` | Получить пользователя по ID | - | - |
| PUT | `/:id` | Обновить профиль пользователя | verifyAccessToken | `{ name, email }` |
| PUT | `/:id/avatar` | Загрузить/обновить аватар | verifyAccessToken | FormData: `avatar` (file) |
| DELETE | `/:id` | Удалить пользователя | - | - |

**Загрузка аватара:**
- Максимальный размер: 1 МБ
- Форматы: JPEG, JPG, PNG, GIF, WEBP
- Сохраняется в: `/src/uploads/`
- Путь в БД: `/uploads/avatar-[timestamp]-[random].jpg`

### Tasks (`/api/tasks`)

| Метод | Endpoint | Описание | Защита | Body/Params |
|-------|----------|----------|--------|-------------|
| GET | `/` | Получить все задачи | - | - |
| GET | `/user/:userId` | Получить задачи пользователя | - | - |
| GET | `/:id` | Получить задачу по ID | - | - |
| POST | `/` | Создать новую задачу | verifyAccessToken | `{ title, status, user_id }` |
| PUT | `/:id` | Обновить задачу | verifyAccessToken + verifyTaskOwner | `{ title?, status? }` |
| DELETE | `/:id` | Удалить задачу | verifyAccessToken + verifyTaskOwner | - |

**verifyTaskOwner** - проверяет, что пользователь является владельцем задачи.

## База данных

### Модели

#### User
```javascript
{
  id: INTEGER (PK, autoIncrement),
  name: STRING (not null),
  email: STRING (not null, unique),
  password: STRING (not null, hashed),
  avatar: STRING (nullable, default: null),
  isActivated: BOOLEAN (not null, default: false),
  activationToken: STRING (nullable, unique),
  createdAt: DATE,
  updatedAt: DATE
}
```
- **Связь:** `hasMany(Task, { foreignKey: 'user_id' })`
- **Hooks:**
  - `beforeCreate`: хеширует пароль (bcrypt, 10 раундов), нормализует email/name
  - `afterCreate`: удаляет пароль из ответа
- **Методы валидации:**
  - `validateEmail(email)` - проверка формата email
  - `validatePassword(password)` - проверка требований к паролю
  - `validateSignInData({ email, password })` - валидация при входе
  - `validateSignUpData({ name, email, password })` - валидация при регистрации
- **Активация:**
  - `isActivated` - флаг активации аккаунта (по умолчанию false)
  - `activationToken` - уникальный токен для активации (UUID v4)

#### Task
```javascript
{
  id: INTEGER (PK, autoIncrement),
  title: STRING,
  status: BOOLEAN,
  user_id: INTEGER (FK -> User.id),
  createdAt: DATE,
  updatedAt: DATE
}
```
- **Связь:** `belongsTo(User, { foreignKey: 'user_id' })`

### Миграции

1. `20251117090234-create-user.js` - создание таблицы Users
2. `20251118071659-create-task.js` - создание таблицы Tasks
3. `20251126161851-add-avatar-to-users.js` - добавление поля avatar
4. `20251126181046-add-activation-fields-to-users.js` - добавление полей isActivated и activationToken

### Команды Sequelize

```bash
# Создать БД
npm run db:create

# Удалить БД
npm run db:drop

# Запустить миграции (с полным сбросом)
npm run db:migrate

# Откатить все миграции
npx sequelize db:migrate:undo:all

# Откатить последнюю миграцию
npx sequelize db:migrate:undo
```

## Безопасность

### Хеширование паролей
- Использует **bcrypt** с 10 раундами
- Автоматическое хеширование через `beforeCreate` hook в модели User
- Сравнение при входе через `bcrypt.compare()`

### JWT токены
**Время жизни** (настройка в `config/jwtConfig.js`):
- **Access Token:** 3 минуты (180 000 ms)
- **Refresh Token:** 24 часа (86 400 000 ms)

**Хранение:**
- Access Token - возвращается в ответе, хранится на клиенте (память)
- Refresh Token - хранится в **httpOnly cookie** (недоступен для JavaScript)

**Cookie настройки:**
```javascript
{
  httpOnly: true,      // защита от XSS
  maxAge: 24 часа,
  sameSite: 'lax',
  secure: false        // в production должно быть true (HTTPS)
}
```

### CORS
- Настроен для `CLIENT_URL` из `.env`
- Credentials: true (для передачи cookies)
- Разрешенные методы: GET, POST, PUT, DELETE

### Валидация

**Требования к паролю:**
- Минимум 8 символов
- Хотя бы одна заглавная буква (A-Z)
- Хотя бы одна строчная буква (a-z)
- Хотя бы одна цифра (0-9)
- Хотя бы один спецсимвол (!@#$%^&*()-,.?":{}|<>)

**Требования к email:**
- Валидный формат email (regex)
- Уникальность в БД

## Middleware

### verifyAccessToken
- Проверяет наличие `Authorization: Bearer <token>` в заголовках
- Верифицирует access token через `jwt.verify()`
- При успехе записывает данные пользователя в `res.locals.user`
- При ошибке возвращает 403 (client обновит токены через interceptor)

### verifyRefreshToken
- Проверяет наличие refresh token в cookies
- Верифицирует через `jwt.verify()`
- При успехе записывает данные в `res.locals.user`

### verifyTaskOwner
- Проверяет, что текущий пользователь является владельцем задачи
- Получает `user.id` из `res.locals.user` (установлен `verifyAccessToken`)
- Сравнивает с `task.user_id`
- При успехе записывает задачу в `res.locals.task`
- При неудаче возвращает 403

### removeHttpHeader
- Удаляет заголовок `X-Powered-By` для безопасности

## Логирование

- **Morgan** логирует все HTTP запросы
- Логи сохраняются в `src/logs/access_[день.месяц.год].log`
- Формат: **Combined** (Apache-style)
- Ротация логов по дням (автоматически)

Пример лога:
```
::1 - - [26/Nov/2025:12:34:56 +0000] "GET /api/users HTTP/1.1" 200 1234
```

## Response Format

Все ответы в формате:

```json
{
  "status": 200,
  "message": "Success message",
  "data": {...},
  "error": null
}
```
