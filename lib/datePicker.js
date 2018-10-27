const Calendar = require('telegraf-calendar-telegram');

function setupDatePicker(bot, callback) {
  const datePicker = new Calendar(bot, {
    startWeekDay: 1,
    weekDayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  });

  bot.action('calendar-telegram-ignore', ctx => ctx.answerCbQuery());

  datePicker.setDateListener(async (ctx, date) => {
    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    await callback(ctx, date);
  });

  return datePicker;
}

module.exports = setupDatePicker;
