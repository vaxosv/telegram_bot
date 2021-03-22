const { Telegraf } = require("telegraf");
import { CronJob } from "cron";
const express = require("express");
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
// const job = schedule.scheduleJob({ hour: 9, minute: 0 }, async () => {
//   love(bot);
// });

const doSomething = new CronJob(
    "0 49 12 * *", //cron time
    love(bot), //replace with your function that you want to call
    null,
    true
);


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

