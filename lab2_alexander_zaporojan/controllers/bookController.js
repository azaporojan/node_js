const books = require('../models/bookModel');
const authors = require('../models/authorModel');

function getBooks(req, res) {
    let result = books;

    if (req.query.genre) {
        result = result.filter((b) => b.genre === req.query.genre);
    }

    if (req.query.year) {
        result = result.filter((b) => b.year === Number(req.query.year));
    }

    res.json(result);
}

function searchBooks(req, res) {
    const title = req.query.title;

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const result = books.filter((b) => b.title.toLowerCase().includes(title.toLowerCase()));
    res.json(result);
}

function getBookById(req, res) {
    const id = Number(req.params.id);
    const book = books.find((b) => b.id === id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
}

function createBook(req, res) {
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is required' });
    }

    const title = req.body.title;
    const authorId = req.body.authorId;
    const genre = req.body.genre;
    const year = req.body.year;

    if (!title || !authorId || !genre || !year) {
        return res.status(400).json({ error: 'Fields title, authorId, genre and year are required' });
    }

    const author = authors.find((a) => a.id === Number(authorId));

    if (!author) {
        return res.status(400).json({ error: 'Author does not exist' });
    }

    let maxId = 0;
    for (const book of books) {
        if (book.id > maxId) {
            maxId = book.id;
        }
    }

    const newBook = {
        id: maxId + 1,
        title: title,
        authorId: Number(authorId),
        genre: genre,
        year: Number(year)
    };

    books.push(newBook);
    res.status(201).json(newBook);
}

function updateBook(req, res) {
    const id = Number(req.params.id);
    const book = books.find((b) => b.id === id);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    if (!req.body) {
        return res.status(400).json({ error: 'Request body is required' });
    }

    if (req.body.authorId) {
        const author = authors.find((a) => a.id === Number(req.body.authorId));

        if (!author) {
            return res.status(400).json({ error: 'Author does not exist' });
        }

        book.authorId = Number(req.body.authorId);
    }

    if (req.body.title) {
        book.title = req.body.title;
    }

    if (req.body.genre) {
        book.genre = req.body.genre;
    }

    if (req.body.year) {
        book.year = Number(req.body.year);
    }

    res.json(book);
}

function deleteBook(req, res) {
    const id = Number(req.params.id);
    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const deleted = books.splice(index, 1);
    res.json({ message: 'Book deleted', book: deleted[0] });
}

function getStatistics(req, res) {
    const genres = [];
    for (const book of books) {
        if (!genres.includes(book.genre)) {
            genres.push(book.genre);
        }
    }

    let newest = books[0];
    let oldest = books[0];
    for (const book of books) {
        if (book.year > newest.year) {
            newest = book;
        }
        if (book.year < oldest.year) {
            oldest = book;
        }
    }

    res.json({
        booksCount: books.length,
        authorsCount: authors.length,
        genresCount: genres.length,
        newestBook: newest,
        oldestBook: oldest
    });
}

module.exports = {
    getBooks,
    searchBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    getStatistics
};
