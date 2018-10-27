const { postHomework } = require('../homework');

module.exports = () => ctx => {
  ctx.pickDate('Pick a date', async (pickerCtx, date) => {
    await pickerCtx.reply('Please, send me a text, photo, video or document');

    pickerCtx.ask({
      validator: answerCtx => {
        const msg = answerCtx.message;
        return msg.text || msg.photo || msg.video || msg.document;
      },
      onSuccess: async answerCtx => {
        await postHomework(date, answerCtx.message.message_id);
        await answerCtx.reply('Done!');
      },
      onInvalid: answerCtx =>
        answerCtx.reply('Please, send me a text, photo, video or document'),
    });
  });
};
