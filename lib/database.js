const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const config = require('../config.json');

const database = low(new FileAsync(config.database.file));
database.defaults({}).write();
module.exports = database;
