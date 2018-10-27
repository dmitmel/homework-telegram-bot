const Scene = require('telegraf/scenes/base');
const setupDatePicker = require('../datePicker');
const { Post } = require('../database');

const scene = new Scene('calendar');

const datePicker = setupDatePicker(scene, async (ctx, date) => {
  const posts = await Post.find({ date });

  if (posts.length) {
    await ctx.reply(`Homework for ${date}:`);
    await Promise.all(
      posts.map(post =>
        ctx.telegram.forwardMessage(ctx.chat.id, ctx.chat.id, post.messageID),
      ),
    );
  } else {
    await ctx.reply(`No homework for ${date}`);
  }

  ctx.scene.leave();
});

scene.enter(ctx => ctx.reply('Pick a date', datePicker.getCalendar()));
scene.use(ctx => ctx.reply('Please, pick a date'));

module.exports = scene;
