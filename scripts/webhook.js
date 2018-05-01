const getEnv = require('../lib/utils/getEnv');
const { startWebhook } = require('../lib');

const serverURL = getEnv('WEBHOOK_SERVER_URL');
const port = getEnv('WEBHOOK_PORT', 3000);

startWebhook(serverURL, port);
