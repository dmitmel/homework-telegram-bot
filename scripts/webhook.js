const { startWebhook } = require('../lib');
const config = require('../config.json');

const { hostname, port, path } = config.webhook;
startWebhook(hostname, port, new URL(path, `http://${hostname}:${port}`));
