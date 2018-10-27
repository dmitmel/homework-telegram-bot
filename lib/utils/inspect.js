const util = require('util');
const chalk = require('chalk').default;

function inspect(object, options) {
  return util.inspect(object, {
    colors: chalk.level > 0,
    ...options,
  });
}

module.exports = inspect;
