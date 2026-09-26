const express = require('express');
const logger = require('./middleware/logger');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const bookController = require('./controllers/bookController');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);

app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.get('/api/statistics', bookController.getStatistics);

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Invalid JSON in request body and other errors
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
