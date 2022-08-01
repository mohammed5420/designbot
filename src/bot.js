require("dotenv").config();
const { Client, Intents } = require("discord.js");
const fs = require("fs");
const puppeteer = require("puppeteer");
require("../db.config");

const LastShot = require("./Shot");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// const channel = new Channel(client);
client.on("ready", async () => {
  console.log("Bot is ready");

  const channel = client.channels.cache.get("953334253142290432");

  setInterval(async () => {
    //Lunch puppeteer headless browser
    try {
      const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
      const page = await browser.newPage();
      await page.goto("https://dribbble.com/shots/popular", {
        waitUntil: "load",
        timeout: 0,
      });
      //Get last shot url
      let shotLink = await page.$eval(".shot-thumbnail-link", (el) => {
        return el.href;
      });
      //check if the last shot url matches the current url
      let lastShot = await LastShot.findOne({ shotID: shotLink });
      
      if (lastShot == null) {
        let docsCount = await LastShot.estimatedDocumentCount();
        if (docsCount > 0) {
          await LastShot.updateOne({ access: true }, { shotID: shotLink });
        } else {
          await LastShot.create({ shotID: shotLink });
        }
        await channel.send(`Shot Link: ${shotLink}`);
        return browser.close();
      }
      return browser.close();
    } catch (error) {
      console.error(error);
    }
  }, 1000 * 60 * 30);
});

client.login(process.env.BOT_TOKEN);

// axios
// .get(`https://api.dribbble.com/v2/shots/18280341-minecraft-ocean-monument-Redesign`, {
//   params: {
//     access_token: process.env.DRIBBBLE_ACCESS_TOKEN,
//   },
// })
// .then((res) => {
//   console.log({res});
//   // res.data.map((project) => {

//   // });
// });

// client.on("messageCreate", (message) => {
//   if (message.content == "design") {
//     message.reply({
//       files: [
//         "https://cdn.dribbble.com/userupload/2846072/file/original-3c5a87a25f237249ffdd9174b8c988f3.png?compress=1&resize=1200x900",
//       ],
//     });
//   }
// });
