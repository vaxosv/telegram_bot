const { Telegraf } = require("telegraf");
const cron = require("node-cron");
const express = require("express");
var CronJob = require("cron").CronJob;
const schedule = require("node-schedule");

const app = express();

// dependencies
let chatIds = [];

const port = process.env.PORT || 3000;
const token = "1784152676:AAGjsAjjNG9rHxAn-tlS5rEK9h1sx0Iglts";

const saveId = (ctx) => {
  const id = ctx.message.chat.id;
  if (!chatIds.includes(id)) {
    chatIds = [...chatIds, id];
  }
};

const forVaxo = (ctx) => {
  return ctx.reply("ანა ვახოსია! ვახოს ძალიან უყვარს ანა");
};

const love = (bot) => {
  chatIds.forEach((id) => {
    bot.telegram.sendMessage(id, "მიყვარხარ");
  });
};

// init
const bot = new Telegraf(token);
bot.start((ctx) => {
  saveId(ctx);
  ctx.reply("Welcome type /ana");
});

bot.command("ana", forVaxo);

bot.launch().then(() => {
  console.log("running...");
});

// jobs
// const job = schedule.scheduleJob({ hour: 18, minute: 15 }, async () => {
//   console.log("gaveshviiiiiiiiiiiii");
//   love(bot);
// });

var job = new CronJob(
  "40 * * * *",
  function () {
    love(bot);
    console.log("You will see this message every second");
  },
  null,
  true,
);
job.start();

// cron.schedule('25 13 * * *', function() {
//   love(bot)
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
