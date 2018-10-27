const CalendarHelper = require('telegraf-calendar-telegram/calendar-helper');
const { Post } = require('./database');

function getHomeworkForDate(date) {
  if (date instanceof Date) date = CalendarHelper.toYyyymmdd(date);
  return Post.find({ date });
}

function postHomework(date, messageID) {
  const post = new Post({ date, messageID });
  return post.save();
}

module.exports = { getHomeworkForDate, postHomework };
