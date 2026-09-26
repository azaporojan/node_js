const books = [
  { id: 1, title: 'The Hobbit', authorId: 1, genre: 'fantasy', year: 1937 },
  { id: 2, title: '1984', authorId: 2, genre: 'dystopia', year: 1949 },
  { id: 3, title: 'Clean Code', authorId: 3, genre: 'programming', year: 2008 },
  { id: 4, title: 'The Lord of the Rings', authorId: 1, genre: 'fantasy', year: 1954 },
  { id: 5, title: 'Animal Farm', authorId: 2, genre: 'dystopia', year: 1945 },
  { id: 6, title: 'Node.js Design Patterns', authorId: 4, genre: 'programming', year: 2014 }
];

let nextId = books.length + 1;

function getAll() {
  return books;
}

function getById(id) {
  return books.find((book) => book.id === id);
}

function getByAuthorId(authorId) {
  return books.filter((book) => book.authorId === authorId);
}

function create(data) {
  const book = { id: nextId++, ...data };
  books.push(book);
  return book;
}

function update(id, data) {
  const book = getById(id);
  if (!book) return null;
  Object.assign(book, data);
  return book;
}

function remove(id) {
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) return null;
  return books.splice(index, 1)[0];
}

module.exports = { getAll, getById, getByAuthorId, create, update, remove };
