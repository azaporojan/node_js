# Лабораторные работы по Node.js / Express.js

Курс «Разработка серверных приложений» (SSdev), секция FR.

**Студент:** Alexander Zaporojan, группа IAFR2302r

**Репозиторий:** [https://github.com/azaporojan/node_js](https://github.com/azaporojan/node_js)

**Этот файл на GitHub:** [https://github.com/azaporojan/node_js/blob/main/README.md](https://github.com/azaporojan/node_js/blob/main/README.md)

## Структура репозитория

Каждая лабораторная работа лежит в своей папке. Внутри каждой папки есть свой `README.md` — это отчёт по работе.

| Папка | Тема | Отчёт |
| --- | --- | --- |
| `lab1_alexander_zaporojan` | Простой HTTP-сервер на модуле `http` | [README](https://github.com/azaporojan/node_js/blob/main/lab1_alexander_zaporojan/README.md) |
| `lab2_alexander_zaporojan` | REST API на Express.js (книги и авторы) | [README](https://github.com/azaporojan/node_js/blob/main/lab2_alexander_zaporojan/README.md) |
| `lab3_alexander_zaporojan` | Веб-приложение на Express.js, EJS и middleware | [README](https://github.com/azaporojan/node_js/blob/main/lab3_alexander_zaporojan/README.md) |
| `lab4_alexander_zaporojan` | CRUD-приложение с PostgreSQL и Sequelize | [README](https://github.com/azaporojan/node_js/blob/main/lab4_alexander_zaporojan/README.md) |
| `lab5_alexander_zaporojan` | Аутентификация, авторизация, логи и WebSocket | [README](https://github.com/azaporojan/node_js/blob/main/lab5_alexander_zaporojan/README.md) |

Лабораторные №3, №4 и №5 — это один проект «Система управления учебными курсами». В каждой следующей работе он становится больше:

- №3 — курсы хранятся в массиве;
- №4 — курсы и преподаватели хранятся в PostgreSQL;
- №5 — добавлены пользователи, роли, сессии, логи и уведомления.

## Как запустить

Все приложения работают на `http://localhost:3000`, поэтому запускать их нужно по одному.

| Работа | Команды |
| --- | --- |
| №1 | `cd lab1_alexander_zaporojan` → `node app.js` |
| №2 | `cd lab2_alexander_zaporojan` → `npm install` → `npm start` |
| №3 | `cd lab3_alexander_zaporojan` → `npm install` → `npm start` |
| №4 | нужен PostgreSQL и файл `.env`, см. отчёт |
| №5 | нужен PostgreSQL и файл `.env`, см. отчёт |

Файлы `.env` и папки `node_modules` в репозиторий не загружаются. Для работ №4 и №5 есть пример `.env.example`.
