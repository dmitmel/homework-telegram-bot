const mongoose = require('mongoose');
const config = require('../config.json');

function connect() {
  return mongoose.connect(config.database.url);
}

function disconnect() {
  return mongoose.disconnect();
}

const postSchema = new mongoose.Schema({
  date: String,
  message: Number
});

const Post = mongoose.model('Post', postSchema);

module.exports = { connect, disconnect, Post };
