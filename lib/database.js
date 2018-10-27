const mongoose = require('mongoose');
const chalk = require('chalk');
const logger = require('./logger');
const config = require('../config.json');

const { url } = config.database;

function connect() {
  logger.info('connecting to the database at %s', chalk.cyan(url));
  return mongoose.connect(url);
}

function disconnect() {
  logger.info('disconnecting from the database');
  return mongoose.disconnect();
}

const postSchema = new mongoose.Schema({
  date: String,
  messageID: Number,
});

const Post = mongoose.model('Post', postSchema);

module.exports = { connect, disconnect, Post };
