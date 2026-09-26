const http = require('http');

console.log('Node.js is working!');

const PORT = 3000;

const student = {
  name: 'Alexander',
  surname: 'Zaporojan',
  group: 'IA2403',
  speciality: 'Applied Informatics'
};

const courses = [
  { title: 'Server-Side Development', teacher: 'Ion Popescu', credits: 6 },
  { title: 'Databases', teacher: 'Maria Ionescu', credits: 5 },
  { title: 'Web Programming', teacher: 'Andrei Rusu', credits: 4 }
];

// Formats a date as DD.MM.YYYY HH:MM
function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function sendText(res, statusCode, text) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(text);
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  // Request logging: HTTP Method | URL | Date and Time
  console.log(`${req.method} | ${req.url} | ${formatDate(new Date())}`);

  if (req.method === 'GET' && req.url === '/') {
    sendText(res, 200, 'Welcome to my first Node.js server!');
  }
  else if (req.method === 'GET' && req.url === '/about') {
    sendText(res, 200, 'About page: a simple HTTP server built with the Node.js http module.');
  }
  else if (req.method === 'GET' && req.url === '/student') {
    sendText(res, 200, `Student: ${student.name} ${student.surname}, group: ${student.group}`);
  }
  else if (req.method === 'GET' && req.url === '/api/student') {
    sendJson(res, 200, student);
  }
  else if (req.method === 'GET' && req.url === '/time') {
    sendText(res, 200, `Current date and time: ${formatDate(new Date())}`);
  }
  else if (req.method === 'GET' && req.url === '/api/courses') {
    sendJson(res, 200, courses);
  }
  // Custom route: random programming tip
  else if (req.method === 'GET' && req.url === '/api/tip') {
    const tips = [
      'Use const by default, let when you need to reassign.',
      'Always handle errors in callbacks and promises.',
      'Keep functions small and focused on one task.'
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    sendJson(res, 200, { tip });
  }
  else {
    sendText(res, 404, '404 - Page not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
