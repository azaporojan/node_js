const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

function getDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
}

const logStream = fs.createWriteStream(path.join(__dirname, '..', 'logs', 'requests.log'), { flags: 'a' });

morgan.token('datetime', () => {
    return getDateTime();
});

const fileLogger = morgan(':method :url | :status | :response-time ms | :datetime', { stream: logStream });

function logAdminAction(req, action, objectType, objectId) {
    const email = req.session.user.email;
    console.log('ADMIN ACTION | ' + email + ' | ' + action + ' ' + objectType.toUpperCase() + ' | ' + objectType + ' ID: ' + objectId + ' | ' + getDateTime());
}

module.exports = { fileLogger, logAdminAction };
