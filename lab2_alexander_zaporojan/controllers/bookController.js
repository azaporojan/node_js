const bookModel = require('../models/bookModel');
const authorModel = require('../models/authorModel');

const REQUIRED_FIELDS = ['title', 'authorId', 'genre', 'year'];

function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

// Checks field types; returns an error message or null
function validateFields(data) {
  if (data.title !== undefined && typeof data.title !== 'string') {
    return 'Field "title" must be a string';
  }
  if (data.genre !== undefined && typeof data.genre !== 'string') {
    return 'Field "genre" must be a string';
  }
  if (data.authorId !== undefined && !Number.isInteger(data.authorId)) {
    return 'Field "authorId" must be an integer';
  }
  if (data.year !== undefined && !Number.isInteger(data.year)) {
    return 'Field "year" must be an integer';
  }
  return null;
}

// GET /api/books  (optional filters: ?genre=...&year=...)
function getAllBooks(req, res) {
  const { genre, year } = req.query;
  let books = bookModel.getAll();

  if (genre) {
    books = books.filter((book) => book.genre.toLowerCase() === genre.toLowerCase());
  }
  if (year) {
    books = books.filter((book) => book.year === Number(year));
  }

  res.status(200).json(books);
}

// GET /api/books/search?title=...
function searchBooks(req, res) {
  const { title } = req.query;

  if (isEmpty(title)) {
    return res.status(400).json({ error: 'Query parameter "title" is required' });
  }

  const query = title.toLowerCase();
  const books = bookModel.getAll().filter((book) => book.title.toLowerCase().includes(query));

  res.status(200).json(books);
}

// GET /api/books/:id
function getBookById(req, res) {
  const book = bookModel.getById(Number(req.params.id));

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.status(200).json(book);
}

// POST /api/books
function createBook(req, res) {
  const body = req.body || {};

  const missing = REQUIRED_FIELDS.filter((field) => isEmpty(body[field]));
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  const { title, authorId, genre, year } = body;

  const typeError = validateFields({ title, authorId, genre, year });
  if (typeError) {
    return res.status(400).json({ error: typeError });
  }

  if (!authorModel.getById(authorId)) {
    return res.status(400).json({ error: 'Author does not exist' });
  }

  const book = bookModel.create({ title, authorId, genre, year });
  res.status(201).json(book);
}

// PATCH /api/books/:id
function updateBook(req, res) {
  const id = Number(req.params.id);
  const body = req.body || {};

  if (!bookModel.getById(id)) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Only known fields can be changed
  const changes = {};
  for (const field of REQUIRED_FIELDS) {
    if (body[field] !== undefined) changes[field] = body[field];
  }

  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: `Provide at least one field to update: ${REQUIRED_FIELDS.join(', ')}` });
  }

  const emptyFields = Object.keys(changes).filter((field) => isEmpty(changes[field]));
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: `Fields cannot be empty: ${emptyFields.join(', ')}` });
  }

  const typeError = validateFields(changes);
  if (typeError) {
    return res.status(400).json({ error: typeError });
  }

  if (changes.authorId !== undefined && !authorModel.getById(changes.authorId)) {
    return res.status(400).json({ error: 'Author does not exist' });
  }

  const book = bookModel.update(id, changes);
  res.status(200).json(book);
}

// DELETE /api/books/:id
function deleteBook(req, res) {
  const book = bookModel.remove(Number(req.params.id));

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.status(200).json({ message: 'Book deleted', book });
}

// GET /api/statistics
function getStatistics(req, res) {
  const books = bookModel.getAll();
  const genres = new Set(books.map((book) => book.genre));

  let newestBook = null;
  let oldestBook = null;
  for (const book of books) {
    if (!newestBook || book.year > newestBook.year) newestBook = book;
    if (!oldestBook || book.year < oldestBook.year) oldestBook = book;
  }

  res.status(200).json({
    booksCount: books.length,
    authorsCount: authorModel.getAll().length,
    genresCount: genres.size,
    newestBook,
    oldestBook
  });
}

module.exports = {
  getAllBooks,
  searchBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getStatistics
};
