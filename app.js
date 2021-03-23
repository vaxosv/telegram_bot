const { Telegraf } = require("telegraf");
const { kittySchema } = require("./database/skima");
const { UserSchema } = require("./database/users.skima");
const GiphyFetch = require("@giphy/js-fetch-api").GiphyFetch;
const express = require("express");
global.fetch = require("node-fetch");
const CronJob = require("cron").CronJob;

const app = express();

// dependencies
const port = process.env.PORT || 3000;
const token = "1784152676:AAGjsAjjNG9rHxAn-tlS5rEK9h1sx0Iglts";
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://vaxosv:qweasdzxc@cluster0.mx7yt.mongodb.net/alldb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("we're connected!");
});

const User = mongoose.model("User", UserSchema);

const saveId = (ctx) => {
  const id = ctx.message.chat.id;
  User.find({}, (err, docs) => {
    if (!!docs.find(databaseItem => databaseItem.chatId !== id.toString())) {
      const user = new User({
        name: ctx.message.form?.username,
        chatId: ctx.message.chat.id,
      });

      user.save(function (err, fluffy) {
        if (err) return console.error(err);
      });
    }
  });
};

const forVaxo = (ctx) => {
  return ctx.reply("ანა ვახოსია! ვახოს ძალიან უყვარს ანა");
};

const sendLove = (bot) => {
  User.find({}, (err, docs) => {
    docs.forEach((user) => {
      (async () => {
        const gf = new GiphyFetch("bQbBAmKcvQR89TWS4RGhvIrjZoeE01UL");

        // fetch 1 gifs
        const { data: gifs } = await gf.random({
          tag: "love",
          limit: 1,
          lang: "en",
          type: "stickers",
        });
        await bot.telegram.sendMessage(user.chatId, "---------------");
        await bot.telegram.sendMessage(user.chatId, gifs.url);
        await bot.telegram.sendMessage(user.chatId, "მიყვარხარ");
        await bot.telegram.sendMessage(user.chatId, "---------------");
      })();
    });
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
  "11 9 * * *",
  function () {
    sendLove(bot);
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
