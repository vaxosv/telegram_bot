const mongoose = require("mongoose");
const { Telegraf } = require("telegraf");
const { UserSchema } = require("./database/users.skima");
const GiphyFetch = require("@giphy/js-fetch-api").GiphyFetch;
global.fetch = require("node-fetch");

const User = mongoose.model("User", UserSchema);
const token = "1784152676:AAGjsAjjNG9rHxAn-tlS5rEK9h1sx0Iglts";
const bot = new Telegraf(token);

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

const sendLove = (bot) => {
  console.log("jobe dooooone");
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

sendLove(bot)
