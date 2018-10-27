const { Post } = require('../database');

module.exports = () => ctx => {
  ctx.pickDate('Pick a date', async (pickerCtx, date) => {
    await pickerCtx.reply('Please, send me a text, photo, video or document');

    pickerCtx.ask({
      validator: answerCtx => {
        const msg = answerCtx.message;
        return msg.text || msg.photo || msg.video || msg.document;
      },
      onSuccess: async answerCtx => {
        const post = new Post({
          date,
          messageID: answerCtx.message.message_id,
        });
        await post.save();
        await answerCtx.reply('Done!');
      },
      onInvalid: answerCtx =>
        answerCtx.reply('Please, send me a text, photo, video or document'),
    });
  });
};
