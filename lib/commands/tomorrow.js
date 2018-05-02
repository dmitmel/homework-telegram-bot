const tomorrow = () => ctx => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  ctx.replyWithHomework(date);
};

module.exports = tomorrow;
