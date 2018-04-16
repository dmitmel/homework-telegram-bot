const chalk = require('chalk').default;
const localtunnel = require('localtunnel');
const logger = require('../lib/logger');
const getEnv = require('../lib/utils/getEnv');
const { startWebhook } = require('../lib/');

const port = getEnv('WEBHOOK_PORT', 3000);

logger.debug('creating local tunnel');
const tunnel = localtunnel(port, (error, tunnelInfo) => {
  if (error) throw error;

  const { url } = tunnelInfo;

  logger.debug('local tunnel created: %s', chalk.cyan(url));
  startWebhook(url, port);
});

tunnel.on('close', () => logger.debug('closing local tunnel'));
