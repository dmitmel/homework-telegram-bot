const chalk = require('chalk').default;

const colors = {
  error: chalk.bgRed,
  warn: chalk.inverse.yellow,
  info: chalk.inverse.green,
  debug: chalk.bgBlue,
  verbose: chalk.inverse.cyan,
  silly: chalk.bgMagenta
};

function colorizeLevel(level) {
  const color = colors[level] || chalk;
  return color.bold(` ${level.toUpperCase()} `);
}

module.exports = colorizeLevel;
