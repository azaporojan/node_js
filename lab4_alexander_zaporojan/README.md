# Лабораторная работа №4

**Тема:** Разработка CRUD-приложения с базой данных и Sequelize

**Студент:** Alexander Zaporojan, группа IA2403

## Цель работы

Научиться подключать Node.js-приложение к PostgreSQL, создавать модели в Sequelize, делать связи между моделями и выполнять операции создания, просмотра, редактирования и удаления данных.

## Приложение

Продолжение работы №3 — «Система управления учебными курсами». Теперь курсы и преподаватели хранятся в PostgreSQL, массивы больше не используются.

## Структура проекта

```text
lab4_alexander_zaporojan/
├── app.js
├── seed.js
├── package.json
├── docker-compose.yml
├── config/
│   └── database.js
├── routes/
│   ├── courseRoutes.js
│   └── teacherRoutes.js
├── controllers/
│   ├── courseController.js
│   └── teacherController.js
├── models/
│   ├── index.js
│   ├── Course.js
│   └── Teacher.js
├── middleware/
│   ├── logger.js
│   └── validateData.js
├── views/
│   ├── courses/      (index, details, create, edit)
│   ├── teachers/     (index, details, create, edit)
│   ├── partials/     (header, footer)
│   ├── statistics.ejs
│   ├── 404.ejs
│   └── error.ejs
├── public/css/style.css
├── .env.example
└── .gitignore
```

Дополнительно к заданию добавлены `seed.js` (начальные данные) и `docker-compose.yml` (запуск PostgreSQL в Docker).

## Запуск

1. Установить пакеты:

```bash
npm install
```

2. Создать файл `.env` по примеру `.env.example`:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=node_courses
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
```

3. Создать базу данных `node_courses` в PostgreSQL. Если PostgreSQL не установлен, его можно запустить в Docker (пароль в этом случае `postgres`):

```bash
docker compose up -d
```

4. Добавить начальные данные (необязательно):

```bash
npm run seed
```

5. Запустить приложение:

```bash
npm start
```

В терминале появится `Database connection established`, приложение откроется на `http://localhost:3000`.

## Модели

**Teacher:** `id`, `name`, `email` (уникальный), `department`, `academicDegree`.

**Course:** `id`, `title`, `credits` (больше нуля), `semester` (от 1 до 8), `description`, `teacherId`.

Связь «один ко многим» настроена в `models/index.js`:

```js
Teacher.hasMany(Course, { foreignKey: 'teacherId' });
Course.belongsTo(Teacher, { foreignKey: 'teacherId' });
```

Имя преподавателя в курсе не хранится, оно берётся из модели `Teacher` через `include`.

## Маршруты

| Метод | URL | Назначение |
| --- | --- | --- |
| GET | `/courses` | Список курсов, поиск и фильтры |
| GET | `/courses/new` | Форма добавления курса |
| POST | `/courses` | Сохранение курса |
| GET | `/courses/:id` | Курс и данные его преподавателя |
| GET | `/courses/:id/edit` | Форма редактирования курса |
| POST | `/courses/:id/edit` | Сохранение изменений |
| POST | `/courses/:id/delete` | Удаление курса |
| GET | `/teachers` | Список преподавателей с количеством курсов |
| GET | `/teachers/new` | Форма добавления преподавателя |
| POST | `/teachers` | Сохранение преподавателя |
| GET | `/teachers/:id` | Преподаватель и его курсы |
| GET | `/teachers/:id/edit` | Форма редактирования преподавателя |
| POST | `/teachers/:id/edit` | Сохранение изменений |
| POST | `/teachers/:id/delete` | Удаление преподавателя |
| GET | `/statistics` | Страница статистики |

## Что было сделано

1. **Подключение.** Параметры лежат в `.env` и читаются через `dotenv`. Файл `.env` добавлен в `.gitignore`. При запуске вызывается `sequelize.authenticate()`, при ошибке выводится понятное сообщение.
2. **Таблицы** создаются через `sequelize.sync()` без `force: true`, поэтому данные не удаляются при перезапуске.
3. **Поиск и фильтрация** выполняются в базе: в контроллере собирается объект `where` (`Op.iLike` для названия, `teacherId`, `semester`) и передаётся в `Course.findAll()`. Все условия работают вместе.
4. **Выбор преподавателя** в форме курса сделан через `<select>`, список берётся из таблицы преподавателей.
5. **Курсы преподавателя** получаются через связь: `Teacher.findByPk(id, { include: Course })`.
6. **Валидация** в `middleware/validateData.js`: проверка полей преподавателя (включая формат и уникальность email) и полей курса (включая существование преподавателя). Там же функция `checkId`, которая для неправильного ID (например `/courses/abc`) показывает страницу 404.
7. **Удаление преподавателя** запрещено, если у него есть курсы. Показывается сообщение «Невозможно удалить преподавателя, у которого есть курсы».
8. **Статистика** считается из базы: `Teacher.count()`, `Course.count()`, группировка по семестрам через `group`, количество курсов у преподавателей через `include`.
9. **Ошибки.** Все функции с базой написаны через `async/await` и `try...catch`. Ошибка передаётся в `next(error)`, и пользователь видит страницу `error.ejs`.

## Результаты проверки

Проверка выполнялась на PostgreSQL 16.

| Запрос | Результат |
| --- | --- |
| Запуск приложения | `Database connection established` |
| Запуск без базы данных | Сообщение «Не удалось подключиться к базе данных...», приложение не падает с необработанной ошибкой |
| `GET /courses`, `/teachers`, `/statistics` | `200` |
| `GET /courses?teacherId=2` | `200`, 2 курса |
| `GET /courses/99`, `/teachers/77` | `404` |
| `GET /courses/abc` | `404` |
| `POST /teachers` с существующим email | `400`, «Преподаватель с таким email уже существует» |
| `POST /teachers` с пустыми полями и email `bad` | `400`, четыре сообщения об ошибках |
| `POST /teachers/1/edit` со своим же email | `302` → `/teachers/1` |
| `POST /teachers/1/edit` с email другого преподавателя | `400` |
| `POST /teachers/1/delete` (есть курсы) | `400`, «Невозможно удалить преподавателя, у которого есть курсы» |
| `POST /teachers/4/delete` (нет курсов) | `302` → `/teachers` |
| `POST /courses` с `teacherId=999` | `400`, «Выбранный преподаватель не существует» |
| `POST /courses` с правильными данными | `302` → `/courses` |
| `POST /courses/6/edit` | `302` → `/courses/6` |
| `POST /courses/6/delete` | `302` → `/courses` |

Таблицы в базе после первого запуска:

```text
 Schema |   Name   | Type
--------+----------+-------
 public | Courses  | table
 public | Teachers | table
```

Страница статистики с начальными данными:

```text
Всего преподавателей: 3
Всего курсов: 5
Преподаватель с наибольшим количеством курсов: Ivan Ivanov (2)
Семестр 1 — 2 курса, семестр 2 — 2 курса, семестр 3 — 1 курс
```

## Вывод

В работе я перенёс данные приложения из массива в PostgreSQL, создал модели `Teacher` и `Course` со связью «один ко многим», сделал CRUD для обеих моделей, поиск и фильтрацию через Sequelize, валидацию, обработку ошибок и страницу статистики.
