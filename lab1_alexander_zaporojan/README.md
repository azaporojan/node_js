# Лабораторная работа №1

**Тема:** Создание простого HTTP-сервера на Node.js

**Студент:** Alexander Zaporojan, группа IA2403

## Цель работы

Познакомиться с Node.js и npm, создать первый проект и написать простой HTTP-сервер, который обрабатывает запросы.

## Файлы

```text
lab1_alexander_zaporojan/
├── app.js
└── package.json
```

Весь код находится в `app.js`. Дополнительные пакеты не нужны, используется только встроенный модуль `http`.

## Запуск

```bash
node app.js
```

Сервер запускается на `http://localhost:3000`.

## Маршруты

| Метод | URL | Результат |
| --- | --- | --- |
| GET | `/` | Приветствие |
| GET | `/about` | Информация о приложении |
| GET | `/student` | Имя, фамилия и группа студента (текст) |
| GET | `/api/student` | Данные студента в формате JSON |
| GET | `/time` | Текущая дата и время |
| GET | `/api/courses` | Массив из трёх дисциплин в формате JSON |
| GET | `/random` | Собственный маршрут: случайное число от 1 до 100 |
| любой | другой URL | `404 - Page not found` и status code 404 |

## Что было сделано

1. Создан проект командой `npm init -y`.
2. Сервер создан через `http.createServer()` и запущен через `server.listen(3000)`.
3. Маршруты определяются через `if / else if` по `req.method` и `req.url`.
4. Для JSON устанавливается заголовок `Content-Type: application/json`, объект превращается в строку через `JSON.stringify()`.
5. Для неизвестного адреса устанавливается настоящий код ответа: `res.statusCode = 404`.
6. Каждый запрос записывается в терминал. Дата собирается из объекта `new Date()` в функции `getDateTime()`.

## Результаты проверки

```text
GET /             → Hello! Welcome to my first Node.js server!          [200]
GET /about        → About: this is a simple HTTP server ...             [200]
GET /student      → Student: Alexander Zaporojan, group: IA2403         [200]
GET /api/student  → {"name":"Alexander Zaporojan","group":"IA2403",...} [200]
GET /time         → Current date and time: 21.11.2026 14:12             [200]
GET /api/courses  → [{"title":"Server-side Development",...}, ...]      [200]
GET /random       → Your random number: 47                              [200]
GET /nope         → 404 - Page not found                                [404]
```

Логи в терминале:

```text
GET /api/courses | 21.11.2026 14:12
GET /random | 21.11.2026 14:12
GET /nope | 21.11.2026 14:12
```

## Ответы для защиты

- `http` — встроенный модуль Node.js для создания HTTP-сервера.
- `req` — объект запроса, в нём лежит информация о том, что прислал клиент.
- `res` — объект ответа, через него сервер отвечает клиенту.
- `req.method` — HTTP-метод запроса (GET, POST и другие).
- `req.url` — адрес, который запросил клиент, например `/about`.
- `res.end()` — отправляет ответ и завершает его.

## Вывод

В работе я установил Node.js, создал проект и написал HTTP-сервер без дополнительных библиотек. Я научился различать запросы по методу и адресу, отправлять текст и JSON, ставить код 404 и логировать запросы.
