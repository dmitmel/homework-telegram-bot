const chalk = require('chalk').default;

function colorizeTimestamp(isoStr) {
  const [, dateStr, timeStr, millisecondsStr] = isoStr.match(
    /^(.+)T(.+)\.(.+)Z$/
  );

  return (
    `${dateStr}${chalk.gray('T')}` +
    `${timeStr}${chalk.gray('.')}` +
    `${millisecondsStr}${chalk.gray('Z')}`
  );
}

module.exports = colorizeTimestamp;
