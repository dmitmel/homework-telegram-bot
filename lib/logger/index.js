const util = require('util');
const winston = require('winston');
const colorizeTimestamp = require('./colorizeTimestamp');
const colorizeLevel = require('./colorizeLevel');

const format = winston.format.printf(({ level, message, splat }) => {
  let timestamp = new Date().toISOString();

  if (typeof message === 'string') {
    if (splat) message = util.format(message, ...splat);
  } else {
    message = util.inspect(message, { colors: true });
  }

  timestamp = colorizeTimestamp(timestamp);
  level = colorizeLevel(level);

  return `[${timestamp}] ${level} \t${message}`;
});

const logger = winston.createLogger({
  level: 'silly',
  format,
  transports: [new winston.transports.Console()]
});

module.exports = logger;
