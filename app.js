const { Telegraf } = require("telegraf");
const { kittySchema } = require("./database/skima");
const express = require("express");
const CronJob = require("cron").CronJob;

const app = express();

// dependencies
let chatIds = [];

const port = process.env.PORT || 3000;
const token = "1784152676:AAGjsAjjNG9rHxAn-tlS5rEK9h1sx0Iglts";
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://vaxosv:qweasdzxc@cluster0.mx7yt.mongodb.net/alldb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("we're connected!");
});

const Kitten = mongoose.model("Kitten", kittySchema);

// const silence = new Kitten({ name: 'Silence' });
// console.log(silence.name); // 'Silence'
//
//
// silence.save(function (err, fluffy) {
//   if (err) return console.error(err);
// });

Kitten.find({ name: /^Silence/ }, (err, docs)=> {
  console.log(docs)
})

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

// job
var job = new CronJob(
  "40 9 * * *",
  function () {
    love(bot);
  },
  null,
  true
);
job.start();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
