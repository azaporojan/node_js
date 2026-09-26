// Formats a date as DD.MM.YYYY HH:MM
function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Logs every request: HTTP Method | URL | Date and Time
function logger(req, res, next) {
  console.log(`${req.method} | ${req.originalUrl} | ${formatDate(new Date())}`);
  next();
}

module.exports = logger;
