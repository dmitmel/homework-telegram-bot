const { getHomeworkForDate } = require('../homework');

const calendar = () => ctx => {
  ctx.pickDate('Pick a date', async (pickerCtx, date) => {
    const posts = await getHomeworkForDate(date);

    if (posts.length) {
      await pickerCtx.reply(`Homework for ${date}:`);

      const chatID = pickerCtx.chat.id;
      await Promise.all(
        posts.map(post =>
          pickerCtx.telegram.forwardMessage(chatID, chatID, post.messageID),
        ),
      );
    } else {
      await pickerCtx.reply(`No homework for ${date}`);
    }
  });
};

module.exports = calendar;
