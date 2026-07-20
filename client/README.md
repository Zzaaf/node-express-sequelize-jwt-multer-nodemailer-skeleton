# Client (Frontend)

React-приложение на **TypeScript** с современным UI, организованное по Feature-Sliced Design.

## Технологии

- **React 19.2.0** — UI-библиотека
- **React Router 7.9.6** — декларативная маршрутизация
- **TypeScript 5.8** — строгая типизация
- **Axios 1.13.2** — HTTP-клиент с interceptors
- **Tailwind CSS 4** — utility-first CSS (через CDN)
- **Vite 8.1.5** — сборщик и dev-сервер (SWC)
- **tsx 4.19** — транспилятор TypeScript для скриптов
- **ESLint 9** — линтинг кода

## Архитектура

Проект следует **Feature-Sliced Design** с путевыми алиасами (`@/` → `src/`).  
Каждый слой имеет barrel-файл `index.ts` для чистых импортов.

```
src/
├── app/
│   └── App.tsx                  # Корневой компонент, роутинг, состояние user
├── entities/                    # Бизнес-сущности и API-классы
│   ├── index.ts                 # export { AuthApi, UserApi, TaskApi }
│   ├── AuthApi.ts
│   ├── UserApi.ts
│   └── TaskApi.ts
├── features/                    # Функциональные блоки (формы)
│   ├── index.ts                 # export { SignInForm, SignUpForm }
│   ├── SignInForm/
│   └── SignUpForm/
├── pages/                       # Страницы приложения
│   ├── index.ts                 # export { HomePage, SignInPage, … }
│   ├── HomePage/
│   ├── SignInPage/
│   ├── SignUpPage/
│   ├── ActivatePage/
│   ├── UsersPage/
│   ├── CurrentUserPage/
│   ├── ProfilePage/
│   ├── TasksPage/
│   ├── MyTasksPage/
│   └── NotFoundPage/
├── widgets/                     # Составные UI-блоки
│   ├── index.ts                 # export { Nav, UserList }
│   ├── Nav/
│   └── UserList/
├── shared/
│   ├── types/
│   │   └── index.ts             # User, Task, ApiResponse<T>, AuthData
│   ├── lib/
│   │   ├── index.ts             # export { axiosInstance, setAccessToken, useTitle }
│   │   ├── axiosInstance.ts     # Настроенный axios с interceptors
│   │   └── useTitle.ts          # Хук для <title>
│   ├── ui/
│   │   ├── index.ts             # export { Icon }
│   │   └── Icon/
│   └── hocs/
│       ├── index.ts             # export { AuthGuard, PublicGuard }
│       ├── AuthGuard.tsx
│       └── PublicGuard.tsx
└── main.tsx                     # Точка входа
```

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Создать .env файл (см. ниже)

# Запуск dev-сервера (с HMR)
npm run dev

# Проверка типов
npm run typecheck

# Сборка для production
npm run build

# Просмотр production-сборки локально
npm run preview

# Линтинг
npm run lint
```

## Переменные окружения

Создайте файл `.env` в корне папки `client`:

```env
# URL API бэкенда
VITE_API_URL=http://localhost:4000/api

# URL сервера для загрузки файлов (аватары)
VITE_SERVER_URL=http://localhost:4000
```

## Страницы и роуты

| Роут | Компонент | Описание | Защита |
|------|-----------|----------|--------|
| `/` | HomePage | Главная страница | — |
| `/signIn` | SignInPage | Страница входа | PublicGuard |
| `/signUp` | SignUpPage | Страница регистрации | PublicGuard |
| `/activate/:token` | ActivatePage | Активация аккаунта по email | — |
| `/users` | UsersPage | Список всех пользователей | — |
| `/users/:id` | CurrentUserPage | Профиль пользователя | — |
| `/profile` | ProfilePage | Редактирование своего профиля | AuthGuard |
| `/tasks` | TasksPage | Все задачи (community board) | AuthGuard |
| `/my-tasks` | MyTasksPage | Личные задачи | AuthGuard |
| `*` | NotFoundPage | 404 | — |

## Entities (API-слой)

Все запросы инкапсулированы в статические классы с полной типизацией.

### AuthApi
- `signUp(data)` — регистрация, отправка письма активации
- `activateAccount(token)` — активация по токену из email
- `signIn(data)` — вход (только активированные аккаунты)
- `signOut()` — выход, очистка cookies
- `refreshTokens()` — обновление access + refresh токенов

### UserApi
- `getAll()` — получить всех пользователей
- `getById(id)` — получить пользователя по ID
- `updateProfile(id, data)` — обновить имя / email
- `uploadAvatar(id, formData)` — загрузить аватар
- `deleteById(id)` — удалить пользователя

### TaskApi
- `getAll()` — получить все задачи
- `getById(id)` — получить задачу по ID
- `getByUserId(userId)` — задачи конкретного пользователя
- `create(data)` — создать задачу
- `updateById(id, data)` — обновить задачу (только владелец)
- `deleteById(id)` — удалить задачу (только владелец)

## Типы (`shared/types`)

```ts
interface User       { id; name; email; avatar; isActivated; ... }
interface Task       { id; title; status; user_id; User?; ... }
interface ApiResponse<T = null> { statusCode; message; data: T; error }
interface AuthData   { user: User; accessToken: string }
```

## Axios Instance

`shared/lib/axiosInstance.ts`:
- Базовый URL из `VITE_API_URL`
- `withCredentials: true` (передача httpOnly cookies)
- Request interceptor — добавляет `Authorization: Bearer <token>`
- Response interceptor — при 403 автоматически обновляет токен через `/refreshTokens`, повторяет исходный запрос; при неудаче — редирект на `/signIn`

## Guards (HOC)

- **AuthGuard** — приватные роуты; если нет авторизации → редирект на `/signIn`
- **PublicGuard** — публичные роуты (вход/регистрация); если авторизован → редирект на `/`

## Ключевые возможности

### TypeScript
- Строгий режим (`strict: true`)
- Путевые алиасы `@/` → `src/` (в `tsconfig.json` и `vite.config.ts`)
- Полная типизация API-ответов через `ApiResponse<T>`

### UI/UX
- Кастомная дизайн-система (CSS-переменные, тёмная тема)
- Адаптивная вёрстка (mobile-first)
- Анимации появления контента
- Динамический `<title>` страницы через `useTitle`
- Loading-спиннеры для всех async-операций
- Flash-уведомления (success / error)
- Превью аватара перед загрузкой
- Статистика задач (всего / выполнено / в процессе)
- Inline-редактирование задач (Enter — сохранить, Escape — отмена)
