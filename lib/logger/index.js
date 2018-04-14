const winston = require('winston');
const colorizeTimestamp = require('./colorizeTimestamp');
const colorizeLevel = require('./colorizeLevel');

const format = winston.format.printf(({ level, message }) => {
  let timestamp = new Date().toISOString();

  timestamp = colorizeTimestamp(timestamp);
  level = colorizeLevel(level);

  return `[${timestamp}] ${level}\t${message}`;
});

const logger = winston.createLogger({
  level: 'silly',
  format,
  transports: [new winston.transports.Console()]
});

module.exports = logger;
