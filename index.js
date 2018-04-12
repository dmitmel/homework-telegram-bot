const Telegraf = require('telegraf');
const config = require('./config.json');

const bot = new Telegraf(config.bot.token);

bot.on('message', ctx => {
  ctx.reply(ctx.message.text);
});

console.log('starting');

bot.telegram.getMe().then(({ username, id }) => {
  bot.options.username = username;
  bot.options.id = id;
  console.log(`connected to bot @${username}`);

  bot.startPolling();
  console.log('started polling');
});
