require("dotenv").config();
const { Client, Intents } = require("discord.js");
const fs = require("fs");
const puppeteer = require("puppeteer");
const cron = require("node-cron");
require("../db.config");

const DribbbleShot = require("./Shot");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// const channel = new Channel(client);

// q: how to create new channel using discord.js?
// a: https://discordjs.guide/popular-topics/faq.html#how-do-i-create-a-channel
client.on("ready", async () => {
  console.log("Bot is ready");
  //create a channel if it doesn't exist with name "inspiration"
  let channel;
  let existedChannel = client.channels.cache.find("name", "inspiration");
  channel = existedChannel
    ? existedChannel
    : await client.channels.create("inspiration", { type: "text" });

  cron.schedule("* * */1 * *", async () => {
    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
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
      let lastShot = await DribbbleShot.findOne({
        shotID: shotLink,
      });

      if (!lastShot) {
        await DribbbleShot.create({ shotID: shotLink });
        await channel.send(`Shot Link: ${shotLink}`);
      }
      return browser.close();
    } catch (error) {
      console.error(error);
    }
  });
});

client.login(process.env.BOT_TOKEN);
