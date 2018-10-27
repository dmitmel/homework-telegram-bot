const WizardScene = require('telegraf/scenes/wizard');
const Composer = require('telegraf/composer');
const setupDatePicker = require('../datePicker');

const { Post } = require('../database');

const dateStep = new Composer();

const datePicker = setupDatePicker(dateStep, async (ctx, date) => {
  ctx.scene.state.date = date;

  await ctx.reply('Please, send me a text, photo, video or document');
  ctx.wizard.next();
});

dateStep.use(ctx => ctx.reply('Please, pick a date'));

const taskStep = new Composer();

taskStep.on(['text', 'photo', 'video', 'document'], async ctx => {
  ctx.scene.state.messageID = ctx.message.message_id;

  const { date, messageID } = ctx.scene.state;
  const post = new Post({ date, messageID });
  await post.save();

  ctx.reply('Done!');
  return ctx.scene.leave();
});

taskStep.use(ctx =>
  ctx.reply('Please, send me a text, photo, video or document'),
);

const scene = new WizardScene(
  'post',
  ctx => {
    ctx.reply('Pick a date', datePicker.getCalendar());
    return ctx.wizard.next();
  },
  dateStep,
  taskStep,
);

module.exports = scene;
