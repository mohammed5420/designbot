require("dotenv").config();
const { Client, Intents } = require("discord.js");
const fs = require("fs");
const puppeteer = require("puppeteer");
const cron = require("node-cron");
require("../db.config");

const LastShot = require("./Shot");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// const channel = new Channel(client);
client.on("ready", async () => {
  console.log("Bot is ready");

  const channel = client.channels.cache.get("953334253142290432");

  cron.schedule("* */1 * * *", async () => {
    try {
      const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
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
  });
});

client.login(process.env.BOT_TOKEN);
