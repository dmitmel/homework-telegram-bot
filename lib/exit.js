const { signals } = require('os').constants;

// #region handlers
const handlers = [];
function onExit(handler) {
  handlers.push(handler);
}

function invokeHandlers(event) {
  return Promise.all(handlers.map(handler => handler(event)));
}
// #endregion

// #region exit
function forceExit(code) {
  process.removeAllListeners();
  process.exit(code);
}

function exit(code) {
  invokeHandlers({ code }).then(() => forceExit(code));
}

process.on('exit', exit);
// #endregion

// #region signals
function handleSignal(signal) {
  const code = 128 + signals[signal];
  invokeHandlers({ signal, code }).then(() => forceExit(code));
}

process.on('SIGHUP', handleSignal); // terminal closes
process.on('SIGINT', handleSignal); // Ctrl + C
process.on('SIGQUIT', handleSignal); // Ctrl + \
process.on('SIGTERM', handleSignal); // `kill` command
// #endregion

module.exports = exit;
exit.forceExit = forceExit;
exit.onExit = onExit;
