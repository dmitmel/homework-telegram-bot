const messageLogger = require('./middleware/messageLogger');

function setupMiddleware(bot) {
  bot.use(messageLogger());
  bot.on('text', ctx => ctx.reply(ctx.message.text));
}

module.exports = setupMiddleware;
