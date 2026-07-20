# JWT Auth Skeleton

Полностэковое демо-приложение с JWT-аутентификацией, управлением пользователями и задачами. Готов к клонированию и расширению.

## Стек технологий

### Frontend (`client/`)
| | |
|---|---|
| **React 19** + **TypeScript 5.8** | UI + строгая типизация |
| **React Router 7** | Клиентская маршрутизация (SPA) |
| **Vite 8.1.5** + SWC | Сборщик и dev-сервер |
| **Axios 1.13** | HTTP-клиент с interceptors |
| **Tailwind CSS 4** | Utility-first CSS (CDN) |
| **tsx 4.19** | Транспилятор TypeScript |

### Backend (`server/`)
| | |
|---|---|
| **Node.js + Express 5** | HTTP-фреймворк |
| **PostgreSQL + Sequelize 6** | БД и ORM |
| **JWT** | Access (3 мин) + Refresh (24 ч) токены |
| **bcrypt** | Хеширование паролей (10 раундов) |
| **Nodemailer** | Email-активация аккаунта |
| **Multer** | Загрузка аватаров |
| **Helmet** | Security HTTP-заголовки |
| **express-rate-limit** | Защита от DDoS / brute-force |

## Реализованный функционал

### Аутентификация
- Регистрация с email-активацией (Nodemailer, HTML-письмо)
- Вход только для активированных аккаунтов
- JWT: Access-токен в памяти, Refresh-токен в httpOnly cookie
- Автоматическое обновление токенов через axios interceptors
- AuthGuard / PublicGuard — защита роутов (HOC)

### Пользователи
- Список всех пользователей с аватарами
- Просмотр профиля любого пользователя
- Редактирование своего профиля (имя, email)
- Загрузка и обновление аватара (превью перед отправкой)
- Градиентный placeholder-аватар с инициалами

### Задачи
- Общая доска задач (все пользователи)
- Личная страница «Мои задачи» со статистикой
- Создание, редактирование (inline), удаление, смена статуса
- Защита: изменять можно только свои задачи (verifyTaskOwner)

### UI/UX
- Кастомная дизайн-система (CSS-переменные, тёмная тема)
- Адаптивная вёрстка (mobile-first)
- Динамический `<title>` на каждой странице
- Loading-спиннеры, flash-уведомления, анимации появления

## Архитектура клиента (Feature-Sliced Design)

```
client/src/
├── app/         # Роутинг, глобальное состояние
├── entities/    # API-классы: AuthApi, UserApi, TaskApi
├── features/    # SignInForm, SignUpForm
├── pages/       # 10 страниц приложения
├── widgets/     # Nav, UserList
└── shared/
    ├── types/   # User, Task, ApiResponse<T>, AuthData
    ├── lib/     # axiosInstance, setAccessToken, useTitle
    ├── ui/      # Icon
    └── hocs/    # AuthGuard, PublicGuard
```

Импорты через алиас `@/` (`@/entities`, `@/shared/lib`, …).  
Каждый слой имеет barrel-файл `index.ts`.

## Быстрый старт (локально)

### 1. Клонирование

```bash
git clone <repository-url>
cd jwt-auth-skeleton
```

### 2. Переменные окружения

**`server/.env`**
```env
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# PostgreSQL
DB_NAME=jwt_demo_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

# JWT (смените в production!)
SECRET_ACCESS_TOKEN=change_me_in_production
SECRET_REFRESH_TOKEN=change_me_in_production

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_NAME=JWT Auth Skeleton
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:4000/api
VITE_SERVER_URL=http://localhost:4000
```

### 3. Установка и запуск

```bash
# Сервер
cd server && npm install
npm run db:create
npm run db:migrate
npm run dev          # http://localhost:4000

# Клиент (отдельный терминал)
cd client && npm install
npm run dev          # http://localhost:5173
```

## Деплой на Render.com

Проект готов к деплою как единый **Web Service** (сервер отдаёт сборку React в production).

### Шаги

1. Создайте **PostgreSQL** базу данных на Render (Database → New PostgreSQL)
2. Создайте **Web Service** из репозитория
3. Укажите настройки:

| Параметр | Значение |
|----------|----------|
| **Root Directory** | *(пусто — корень репозитория)* |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Node Version** | `18` или выше |

4. Добавьте переменные окружения в Web Service → Environment:

| Переменная | Описание |
|---|---|
| `NODE_ENV` | `production` |
| `CLIENT_URL` | URL вашего сервиса на Render |
| `DATABASE_URL` | (или `DB_*` по отдельности) |
| `SECRET_ACCESS_TOKEN` | Случайная строка ≥ 32 символов |
| `SECRET_REFRESH_TOKEN` | Случайная строка ≥ 32 символов |
| `SMTP_*` | Ваши SMTP-настройки |

> **Как работает:** `npm run build` устанавливает зависимости и собирает React-приложение в `client/dist/`. В production-режиме сервер раздаёт эту папку как статику и обрабатывает все неизвестные роуты через `index.html` (SPA catch-all).

## API Endpoints

Базовый путь: `/api`

### Auth
| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/auth/signUp` | Регистрация + письмо активации |
| GET | `/auth/activate/:token` | Активация аккаунта |
| POST | `/auth/signIn` | Вход |
| GET | `/auth/refreshTokens` | Обновление токенов |
| DELETE | `/auth/signOut` | Выход |

### Users
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/users` | Все пользователи |
| GET | `/users/:id` | Пользователь по ID |
| PUT | `/users/:id` | Обновить профиль 🔒 |
| PUT | `/users/:id/avatar` | Загрузить аватар 🔒 |

### Tasks
| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/tasks` | Все задачи |
| GET | `/tasks/user/:userId` | Задачи пользователя |
| POST | `/tasks` | Создать задачу 🔒 |
| PUT | `/tasks/:id` | Обновить задачу 🔒👤 |
| DELETE | `/tasks/:id` | Удалить задачу 🔒👤 |

> 🔒 — требует Access Token · 👤 — только владелец

## Скрипты

### Корень (для деплоя)
```bash
npm run build       # install:server + install:client + build:client
npm start           # запуск сервера (production)
```

### Server
```bash
npm run dev         # node --watch
npm start           # node src/app.js
npm run db:create   # создать БД
npm run db:migrate  # сбросить и применить все миграции
npm run db:drop     # удалить БД
```

### Client
```bash
npm run dev         # Vite dev-сервер
npm run build       # tsc + vite build
npm run typecheck   # проверка типов без сборки
npm run preview     # просмотр production-сборки
npm run lint        # ESLint
```

## Безопасность

- **Helmet** — CSP, HSTS, X-Frame-Options и другие заголовки
- **Rate Limiting** — защита от перебора и DDoS
- **bcrypt** (10 раундов) — хеширование паролей
- **httpOnly cookies** — Refresh токен недоступен для JS (защита от XSS)
- **verifyTaskOwner** — проверка владения ресурсом
- **CORS** — только разрешённые origins из `CLIENT_URL`

## Системные требования

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **PostgreSQL** ≥ 14.0