const chalk = require('chalk').default;
const localtunnel = require('localtunnel');
const logger = require('../lib/logger');
const onExit = require('../lib/utils/onExit');
const { startWebhook } = require('../lib');
const config = require('../config.json');

function createLocalTunnel(port) {
  return new Promise((resolve, reject) => {
    localtunnel(port, (error, tunnel) => {
      if (error) reject(error);
      else resolve(tunnel);
    });
  });
}

const { hostname, port, path } = config.webhook;

createLocalTunnel(port).then(tunnel => {
  logger.info(
    'local tunnel created: %s -> %s',
    chalk.cyan(`http://${hostname}:${port}`),
    chalk.cyan(tunnel.url),
  );

  onExit(() => {
    logger.info('closing local tunnel');
    tunnel.close();
  });

  startWebhook(hostname, port, new URL(path, tunnel.url));
});
