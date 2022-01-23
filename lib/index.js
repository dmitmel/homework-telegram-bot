const chalk = require('chalk');
const logger = require('./logger');
const database = require('./database');
const onExit = require('./utils/onExit');
const inspect = require('./utils/inspect');
const bot = require('./bot');

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

async function startWebhook(hostname, port, webhookURL) {
  await configureBot();
  await database.connect();

  bot.startWebhook(webhookURL.pathname || webhookURL, null, port, hostname);
  logger.info(
    'webhook is listening on %s',
    chalk.cyan(`http://${hostname}:${port}/`),
  );

  logger.debug(
    'adding webhook at %s to the telegram bot',
    chalk.cyan(webhookURL),
  );
  bot.telegram.setWebhook(webhookURL);

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
