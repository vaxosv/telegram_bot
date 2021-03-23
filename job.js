const mongoose = require("mongoose");
const { dateDiff } = require("./helpers/helper");
const { Telegraf } = require("telegraf");
const { UserSchema } = require("./database/users.skima");
const GiphyFetch = require("@giphy/js-fetch-api").GiphyFetch;
global.fetch = require("node-fetch");
const axios = require("axios");

const User = mongoose.model("User", UserSchema);
const token = "1784152676:AAGjsAjjNG9rHxAn-tlS5rEK9h1sx0Iglts";
const weatherApi = 'https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=1bd7a65ab4254a7a8ee7763c42b9396e&include=minutely'
const bot = new Telegraf(token);
const sunny = [800, 801, 802];

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
        await bot.telegram.sendMessage(user.chatId, "დილა მშვიდობის მიყვარხარ");

        axios.get(weatherApi).then(function (response) {
          const isSunny = !!sunny.find(
            (item) => response.data.data[0].weather.code === item
          );
          if (isSunny) {
            bot.telegram.sendMessage(user.chatId, "დღეს შენნაირი დღეა, მზიანი და ლამაზი");
          }
        });

        await bot.telegram.sendMessage(
          user.chatId,
          `თქვენ ერთად ხართ${dateDiff(new Date("2017-08-21"), new Date())}`
        );
        await bot.telegram.sendMessage(user.chatId, "---------------");
      })();
    });
  });
};

sendLove(bot);
