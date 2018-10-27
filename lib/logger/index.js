const util = require('util');
const chalk = require('chalk').default;
const winston = require('winston');
const { SPLAT } = require('triple-beam');

const colorizeTimestamp = require('./colorizeTimestamp');
const colorizeLevel = require('./colorizeLevel');

function createFormatter(colors) {
  return winston.format.printf(({ level, message, [SPLAT]: splat }) => {
    let timestamp = new Date().toISOString();

    if (colors) {
      timestamp = colorizeTimestamp(timestamp);
      level = colorizeLevel(level);
    }

    if (typeof message === 'string') {
      if (splat) message = util.format(message, ...splat);
    } else {
      message = util.inspect(message, { colors });
    }

    return `[${timestamp}] ${level} \t${message}`;
  });
}

const logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console({
      format: createFormatter(chalk.level > 0),
      handleExceptions: true,
    }),
    new winston.transports.File({
      filename: 'bot.log',
      format: createFormatter(false),
      handleExceptions: true,
    }),
  ],
});

module.exports = logger;
