const Calendar = require('telegraf-calendar-telegram');

const handlers = {};

function setup(bot) {
  const datePicker = new Calendar(bot, {
    startWeekDay: 1,
    weekDayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  });

  bot.action('calendar-telegram-ignore', ctx => ctx.answerCbQuery());

  datePicker.setDateListener(async (ctx, date) => {
    const handler = handlers[ctx.chat.id];
    if (handler) await handler(ctx, date);
  });

  bot.command('cancel', async (ctx, next) => {
    const handler = handlers[ctx.chat.id];
    if (handler) {
      await ctx.deleteMessage(handler.pickerMessageID);
      delete handlers[ctx.chat.id];
      await ctx.reply('Canceled');
    }
    await next();
  });

  function pickDate(text, callback) {
    const ctx = this;

    async function handler(pickerCtx, date) {
      await pickerCtx.answerCbQuery();
      await ctx.deleteMessage(handler.pickerMessageID);

      delete handlers[ctx.chat.id];

      return callback(pickerCtx, date);
    }

    handlers[ctx.chat.id] = handler;

    ctx.reply(text, datePicker.getCalendar()).then(message => {
      handler.pickerMessageID = message.message_id;
    });
  }

  bot.context.pickDate = pickDate;
}

module.exports = setup;
