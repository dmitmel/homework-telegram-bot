const { signals } = require('os').constants;
const chalk = require('chalk').default;
const logger = require('../logger');

// #region handlers
const handlers = [];
function onExit(handler) {
  handlers.push(handler);
}

async function exitWithEvent(event) {
  const { signal, code } = event;

  if (signal) logger.debug('received signal %s', signal);
  logger.info(
    'exiting with code %s',
    (code === 0 ? chalk.greenBright : chalk.redBright)(code),
  );

  await Promise.all(handlers.map(handler => handler()));
  process.removeAllListeners();
  process.exit(code);
}
// #endregion

// #region exit
process.on('exit', code => exitWithEvent({ code }));
// #endregion

// #region signals
const handleSignal = signal =>
  exitWithEvent({ signal, code: 128 + signals[signal] });
process.on('SIGHUP', handleSignal); // terminal closes
process.on('SIGINT', handleSignal); // Ctrl + C
process.on('SIGQUIT', handleSignal); // Ctrl + \
process.on('SIGTERM', handleSignal); // `kill` command
// #endregion

module.exports = onExit;
