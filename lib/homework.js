const CalendarHelper = require('telegraf-calendar-telegram/calendar-helper');
const { Post } = require('./database');

function getHomeworkForDate(date) {
  if (date instanceof Date) date = CalendarHelper.toYyyymmdd(date);
  return Post.find({ date });
}

function postHomework(date, message) {
  const post = new Post({ date, message });
  return post.save();
}

module.exports = { getHomeworkForDate, postHomework };
