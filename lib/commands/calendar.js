const calendar = datePicker => ctx =>
  ctx.reply('Calendar:', datePicker.getCalendar());

module.exports = calendar;
