const http = require('http');

const student = {
    name: 'Alexander Zaporojan',
    group: 'IA2403',
    speciality: 'Applied Informatics'
};

const courses = [
    { title: 'Server-side Development', teacher: 'Ion Popescu', credits: 6 },
    { title: 'Databases', teacher: 'Maria Ionescu', credits: 5 },
    { title: 'Web Programming', teacher: 'Andrei Rusu', credits: 4 }
];

function getDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
}

const server = http.createServer((req, res) => {
    console.log(req.method + ' ' + req.url + ' | ' + getDateTime());

    if (req.method === 'GET' && req.url === '/') {
        res.end('Hello! Welcome to my first Node.js server!');
    }
    else if (req.method === 'GET' && req.url === '/about') {
        res.end('About: this is a simple HTTP server made with Node.js and the http module');
    }
    else if (req.method === 'GET' && req.url === '/student') {
        res.end('Student: ' + student.name + ', group: ' + student.group);
    }
    else if (req.method === 'GET' && req.url === '/api/student') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(student));
    }
    else if (req.method === 'GET' && req.url === '/time') {
        res.end('Current date and time: ' + getDateTime());
    }
    else if (req.method === 'GET' && req.url === '/api/courses') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(courses));
    }
    else if (req.method === 'GET' && req.url === '/random') {
        const number = Math.floor(Math.random() * 100) + 1;
        res.end('Your random number: ' + number);
    }
    else {
        res.statusCode = 404;
        res.end('404 - Page not found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
