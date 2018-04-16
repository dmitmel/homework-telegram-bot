const chalk = require('chalk').default;
const localtunnel = require('localtunnel');
const logger = require('../lib/logger');
const { onExit } = require('../lib/exit');
const getEnv = require('../lib/utils/getEnv');
const { startWebhook } = require('../lib/');

const port = getEnv('WEBHOOK_PORT', 3000);

logger.info('creating local tunnel');
const tunnel = localtunnel(port, (error, tunnelInfo) => {
  if (error) throw error;

  const { url } = tunnelInfo;

  logger.info('local tunnel created: %s', chalk.cyan(url));
  startWebhook(url, port);
});

onExit(() => {
  logger.info('closing local tunnel');
  tunnel.close();
});
