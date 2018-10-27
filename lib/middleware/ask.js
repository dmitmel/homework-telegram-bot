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

  bot.command('cancel', (ctx, next) => {
    const question = questions[ctx.chat.id];
    if (!question) return next();

    delete questions[ctx.chat.id];
    return ctx.reply('Canceled');
  });

  bot.use((ctx, next) => {
    const question = questions[ctx.chat.id];
    if (!question) return next();
    if (!question.validator(ctx)) return question.onInvalid(ctx);

    delete questions[ctx.chat.id];
    return question.onSuccess(ctx);
  });

  bot.context.ask = ask;
}

module.exports = setup;
