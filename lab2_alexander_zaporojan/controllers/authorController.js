const authors = require('../models/authorModel');
const books = require('../models/bookModel');

function getAuthors(req, res) {
    res.json(authors);
}

function getAuthorById(req, res) {
    const id = Number(req.params.id);
    const author = authors.find((a) => a.id === id);

    if (!author) {
        return res.status(404).json({ error: 'Author not found' });
    }

    res.json(author);
}

function getAuthorBooks(req, res) {
    const id = Number(req.params.id);
    const author = authors.find((a) => a.id === id);

    if (!author) {
        return res.status(404).json({ error: 'Author not found' });
    }

    const authorBooks = books.filter((b) => b.authorId === id);
    res.json(authorBooks);
}

module.exports = { getAuthors, getAuthorById, getAuthorBooks };
