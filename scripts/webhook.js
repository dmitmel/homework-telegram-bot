const getEnv = require('../lib/utils/getEnv');
const Bot = require('../lib/bot');

const serverURL = getEnv('WEBHOOK_SERVER_URL');
const port = getEnv('WEBHOOK_PORT', 3000);

const bot = new Bot();
bot.startWebhook(serverURL, port);
