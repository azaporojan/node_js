# Node.js labs — Alexander Zaporojan

| Folder | Lab | Run |
|---|---|---|
| `lab1_alexander_zaporojan` | Lab 1 — simple HTTP server on the built-in `http` module | `cd lab1_alexander_zaporojan && node app.js` |
| `lab2_alexander_zaporojan` | Lab 2 — REST API on Express.js (MVC) | `cd lab2_alexander_zaporojan && npm install && npm start` |

Both servers listen on http://localhost:3000.

## Lab 1 routes

| Method | URL | Result |
|---|---|---|
| GET | `/` | Greeting |
| GET | `/about` | About the app |
| GET | `/student` | Student name, surname and group (text) |
| GET | `/api/student` | Student data (JSON) |
| GET | `/time` | Current date and time |
| GET | `/api/courses` | Courses list (JSON) |
| GET | `/api/tip` | Custom route: random programming tip (JSON) |
| * | anything else | `404 - Page not found` with real 404 status |

Each request is logged as `GET | /about | 09.09.2026 15:25`.

## Lab 2 routes

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/books` | All books, filters `?genre=` and `?year=` |
| GET | `/api/books/search?title=` | Case-insensitive search by part of title |
| GET | `/api/books/:id` | Book by ID (404 `Book not found`) |
| POST | `/api/books` | Create book → 201; 400 on missing fields or unknown `authorId` |
| PATCH | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |
| GET | `/api/authors` | All authors |
| GET | `/api/authors/:id` | Author by ID |
| GET | `/api/authors/:id/books` | Books of an author |
| GET | `/api/statistics` | Books/authors/genres count, newest and oldest book |
| * | anything else | 404 `{"error": "Route not found"}` |

Example POST body:

```json
{ "title": "Clean Code", "authorId": 3, "genre": "programming", "year": 2008 }
```
