const questions = {};

module.exports = function ask({ validator, onInvalid } = {}) {
  return new Promise(resolve => {
    const chatID = this.chat.id;
    if (!questions[chatID]) {
      questions[chatID] = {
        validator,
        onSuccess: resolve,
        onInvalid
      };
    }
  });
};

module.exports.middleware = () => (ctx, next) => {
  const chatID = ctx.chat.id;
  const question = questions[chatID];
  if (question) {
    const answer = ctx.message;

    const isValid = question.validator ? question.validator(answer) : true;
    if (isValid) {
      delete questions[chatID];
      return question.onSuccess
        ? question.onSuccess(answer)
        : Promise.resolve();
    }
    return question.onInvalid ? question.onSuccess(answer) : Promise.resolve();
  }
  return next();
};

module.exports.cancel = () => (ctx, next) => {
  const chatID = ctx.chat.id;
  const question = questions[chatID];
  if (question) {
    delete questions[chatID];
    return undefined;
  }
  return next();
};
