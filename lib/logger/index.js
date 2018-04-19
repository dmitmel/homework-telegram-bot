const util = require('util');
const winston = require('winston');
const inspect = require('../utils/inspect');
const colorizeTimestamp = require('./colorizeTimestamp');
const colorizeLevel = require('./colorizeLevel');

const format = winston.format.printf(({ level, message, splat }) => {
  let timestamp = new Date().toISOString();

  if (typeof message === 'string') {
    if (splat) message = util.format(message, ...splat);
  } else {
    message = inspect(message);
  }

  timestamp = colorizeTimestamp(timestamp);
  level = colorizeLevel(level);

  return `[${timestamp}] ${level} \t${message}`;
});

const logger = winston.createLogger({
  level: 'silly',
  format,
  transports: [
    new winston.transports.Console({
      handleExceptions: true
    }),
    new winston.transports.File({
      filename: 'bot.log',
      handleExceptions: true
    })
  ]
});

module.exports = logger;
