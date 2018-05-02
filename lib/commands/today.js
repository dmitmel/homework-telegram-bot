const today = () => ctx => {
  const date = new Date();
  return ctx.replyWithHomework(date);
};

module.exports = today;
