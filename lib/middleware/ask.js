function setup(bot) {
  const questions = {};

  function ask({ validator, onSuccess, onInvalid } = {}) {
    const chatID = this.chat.id;
    if (!questions[chatID]) {
      questions[chatID] = {
        validator: validator || (() => true),
        onSuccess: onSuccess || (() => {}),
        onInvalid: onInvalid || (() => {}),
      };
    }
  }

  bot.command('cancel', async (ctx, next) => {
    const question = questions[ctx.chat.id];
    if (question) {
      delete questions[ctx.chat.id];
      await ctx.reply('Canceled');
    }
    await next();
  });

  bot.use(async (ctx, next) => {
    const question = questions[ctx.chat.id];
    if (question) {
      if (question.validator(ctx)) {
        delete questions[ctx.chat.id];
        await question.onSuccess(ctx);
      } else {
        await question.onInvalid(ctx);
      }
    }

    await next();
  });

  bot.context.ask = ask;
}

module.exports = setup;
