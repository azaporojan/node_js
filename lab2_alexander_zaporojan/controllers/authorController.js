const authorModel = require('../models/authorModel');
const bookModel = require('../models/bookModel');

// GET /api/authors
function getAllAuthors(req, res) {
  res.status(200).json(authorModel.getAll());
}

// GET /api/authors/:id
function getAuthorById(req, res) {
  const author = authorModel.getById(Number(req.params.id));

  if (!author) {
    return res.status(404).json({ error: 'Author not found' });
  }

  res.status(200).json(author);
}

// GET /api/authors/:id/books
function getAuthorBooks(req, res) {
  const id = Number(req.params.id);

  if (!authorModel.getById(id)) {
    return res.status(404).json({ error: 'Author not found' });
  }

  res.status(200).json(bookModel.getByAuthorId(id));
}

module.exports = { getAllAuthors, getAuthorById, getAuthorBooks };
