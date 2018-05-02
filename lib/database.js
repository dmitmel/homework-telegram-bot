const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const config = require('../config.json');

const database = low(new FileSync(config.database.file));

database.defaults({ homework: {} }).write();

module.exports = database;
