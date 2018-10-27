const chalk = require('chalk');
const logger = require('./logger');
const database = require('./database');
const onExit = require('./utils/onExit');
const inspect = require('./utils/inspect');
const bot = require('./bot');
const config = require('../config.json');

// crash on unhandled rejections
process.on('unhandledRejection', error => {
  throw error;
});

bot.catch(error => logger.exceptions.catcher(error));

onExit(() => stop());

async function configureBot() {
  logger.info('configuring bot');

  const account = await bot.telegram.getMe();
  logger.debug(
    'bot account info: %s',
    inspect(account, { breakLength: Infinity }),
  );

  bot.options.username = account.username;
  bot.options.id = account.id;
}

async function startPolling() {
  await configureBot();
  await database.connect();

  bot.startPolling();
  logger.info('started polling updates');
}

async function startWebhook(serverURL, port) {
  await configureBot();
  await database.connect();

  logger.debug('adding webhook to the telegram bot');
  bot.telegram.setWebhook(`${serverURL}${config.bot.webhookPath}`);

  bot.startWebhook(config.bot.webhookPath, null, port);
  logger.info('webhook is listening on %s', chalk.cyan(`${serverURL}:${port}`));

  onExit(() => {
    logger.debug('removing webhook from the telegram bot');
    return bot.telegram.deleteWebhook();
  });
}

async function stop() {
  await new Promise(resolve => bot.stop(resolve));
  await database.disconnect();

  logger.info('stopped');
}

module.exports = { startPolling, startWebhook };
