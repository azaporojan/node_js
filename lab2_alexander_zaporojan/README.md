# Лабораторная работа №2

**Тема:** Создание REST API на Express.js

**Студент:** Alexander Zaporojan, группа IA2403

## Цель работы

Познакомиться с Express.js, научиться создавать маршруты, работать с параметрами URL и query-параметрами, возвращать JSON и разделять проект по архитектуре MVC.

## Структура проекта

```text
lab2_alexander_zaporojan/
├── app.js
├── package.json
├── routes/
│   ├── bookRoutes.js
│   └── authorRoutes.js
├── controllers/
│   ├── bookController.js
│   └── authorController.js
├── models/
│   ├── bookModel.js
│   └── authorModel.js
└── middleware/
    └── logger.js
```

- `models` — массивы с книгами (6 штук) и авторами (4 штуки);
- `controllers` — функции, которые обрабатывают запросы;
- `routes` — связывают адреса с функциями из контроллеров;
- `middleware/logger.js` — логирование запросов;
- `app.js` — создаёт приложение и подключает всё остальное.

## Запуск

```bash
npm install
npm start
```

Сервер запускается на `http://localhost:3000`.

## Маршруты

| Метод | URL | Назначение |
| --- | --- | --- |
| GET | `/api/books` | Все книги, фильтры `?genre=` и `?year=` |
| GET | `/api/books/search?title=` | Поиск по части названия без учёта регистра |
| GET | `/api/books/:id` | Книга по ID |
| POST | `/api/books` | Добавление книги |
| PATCH | `/api/books/:id` | Изменение книги |
| DELETE | `/api/books/:id` | Удаление книги |
| GET | `/api/authors` | Все авторы |
| GET | `/api/authors/:id` | Автор по ID |
| GET | `/api/authors/:id/books` | Книги выбранного автора |
| GET | `/api/statistics` | Статистика |
| любой | другой URL | `{"error": "Route not found"}` и код 404 |

## Что было сделано

1. Установлен Express, проект разделён на папки `routes`, `controllers`, `models`, `middleware`.
2. Подключён `express.json()`, чтобы читать JSON из тела запроса.
3. Фильтрация книг сделана через `req.query` и метод `filter`.
4. При добавлении книги проверяются обязательные поля (`400`) и существование автора (`400`). Новый ID считается как максимальный ID + 1.
5. Маршрут `/search` объявлен раньше, чем `/:id`, иначе слово `search` попадало бы в `:id`.
6. Middleware `logger` подключён через `app.use()` до маршрутов, поэтому работает для всех запросов.
7. Неизвестные маршруты обрабатываются последним `app.use()` в `app.js`.

## Результаты проверки

```text
GET /api/books?genre=fantasy&year=1937
[{"id":1,"title":"The Hobbit","authorId":1,"genre":"fantasy","year":1937}]            [200]

GET /api/books/search?title=NODE
[{"id":6,"title":"Node.js Design Patterns","authorId":4,"genre":"programming","year":2014}] [200]

GET /api/books/99
{"error":"Book not found"}                                                              [404]

POST /api/books  {"title":"Refactoring","authorId":3,"genre":"programming","year":1999}
{"id":7,"title":"Refactoring","authorId":3,"genre":"programming","year":1999}           [201]

POST /api/books  (без authorId)
{"error":"Fields title, authorId, genre and year are required"}                         [400]

POST /api/books  (authorId: 50)
{"error":"Author does not exist"}                                                       [400]

PATCH /api/books/7  {"year":2000}
{"id":7,"title":"Refactoring","authorId":3,"genre":"programming","year":2000}           [200]

DELETE /api/books/7
{"message":"Book deleted","book":{...}}                                                 [200]

GET /api/statistics
{"booksCount":6,"authorsCount":4,"genresCount":3,"newestBook":{...2014},"oldestBook":{...1937}} [200]

GET /zzz
{"error":"Route not found"}                                                             [404]
```

Логи в терминале:

```text
GET | /api/statistics | 21.11.2026 14:13
GET | /zzz | 21.11.2026 14:13
```

Пример запроса для проверки POST:

```bash
curl -X POST http://localhost:3000/api/books -H "Content-Type: application/json" -d '{"title":"Refactoring","authorId":3,"genre":"programming","year":1999}'
```

## Ответы для защиты

- **Node.js и Express.js.** Node.js — среда, в которой выполняется JavaScript на сервере. Express.js — библиотека (framework) для Node.js, которая упрощает создание маршрутов и обработку запросов.
- **Router** — группирует маршруты одной сущности в отдельном файле.
- **Controller** — функции, в которых находится логика обработки запроса.
- `req.params` — параметры из адреса, например `:id` в `/api/books/2`.
- `req.query` — параметры после знака `?`, например `?genre=fantasy`.
- `req.body` — данные из тела запроса (JSON в POST и PATCH).
- Коды: `200` — успешно, `201` — создано, `400` — неправильные данные, `404` — не найдено.

## Вывод

В работе я создал REST API на Express.js, разделил код по MVC, сделал все операции с книгами, фильтрацию, поиск, статистику и собственный middleware для логирования.
