function setupMiddleware(bot) {
  bot.on('message', ctx => ctx.reply(ctx.message.text));
}

module.exports = setupMiddleware;
