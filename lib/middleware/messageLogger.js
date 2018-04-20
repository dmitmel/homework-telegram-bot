/* eslint-disable camelcase */

const chalk = require('chalk').default;
const replicators = require('telegraf/core/replicators');
const logger = require('../logger');

const messageLogger = () => (ctx, next) => {
  const msg = ctx.message || ctx.editedMessage;
  if (msg) logger.info(formatMessage(msg));
  return next();
};

function formatMessage(msg) {
  let str = `(${chalk.blue(msg.message_id)})`;

  str += ` ${formatUser(msg.from)}`;

  if (msg.chat.title) str += ` in ${chalk.green(msg.chat.title)}`;

  const forward = msg.forward_from;
  if (forward) str += ` (fwd from ${formatUser(forward)})`;

  const reply = msg.reply_to_message;
  if (reply) str += ` (re to ${chalk.blue(reply.message_id)})`;

  if (msg.edit_date) str += ' (edit)';

  if (msg.text) {
    str += ` > ${msg.text}`;
  } else if (msg.new_chat_members) {
    str += `: added ${msg.new_chat_members.map(formatUser).join(', ')}`;
  } else if (msg.left_chat_member) {
    str += `: removed ${formatUser(msg.left_chat_member)}`;
  } else {
    const type = getMessageType(msg);
    str += `: ${type || 'message'}`;
  }

  return str;
}

const MESSAGE_TYPES = Object.keys(replicators.copyMethods);
function getMessageType(msg) {
  return MESSAGE_TYPES.find(type => msg[type]);
}

function formatUser({ first_name, last_name }) {
  let name = first_name;
  if (last_name) name += ` ${last_name}`;
  return chalk.yellow(name);
}

module.exports = messageLogger;
