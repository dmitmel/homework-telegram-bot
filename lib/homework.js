const CalendarHelper = require('telegraf-calendar-telegram/calendar-helper');
const homeworkDB = require('./database').get('homework');

function getHomeworkForDate(date) {
  if (date instanceof Date) date = CalendarHelper.toYyyymmdd(date);
  return homeworkDB.get(date).value();
}

function replyWithHomework(date) {
  const homework = getHomeworkForDate(date);
  return homework ? this.reply(homework) : Promise.resolve();
}

module.exports = replyWithHomework;
