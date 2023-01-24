const { Client } = require("discord.js");
const puppeteer = require("puppeteer");
const cron = require("node-cron");
const DribbbleShot = require("./Shot");
require("./db/db.config");
require("dotenv").config();

const client = new Client({
  intents: ["GuildMessages", "Guilds", "GuildMessageTyping"],
});

// const channel = new Channel(client);

// q: how to create new channel using discord.js?
// a: https://discordjs.guide/popular-topics/faq.html#how-do-i-create-a-channel
client.on("ready", async () => {
  console.log("Bot is ready");
  //Find channel with id of 953334253142290432 if now create a new channel
  //map over all guilds and find channel with id of name inspiration
  client.guilds.cache.map(async (guild) => {
    const existedChannel = guild.channels.cache.find(
      (channel) => channel.name === "💡-inspirations"
    );

    if (!existedChannel)
      await guild.channels.create({
        name: "💡-inspirations",
      });
  });

  const getInspirationChannels = async () => {
    //map over guilds and find channel with id of name inspiration
    const inspirationChannels = client.guilds.cache.map((guild) => {
      return guild.channels.cache.find(
        (channel) => channel.name === "💡-inspirations"
      );
    });

    return inspirationChannels;
  };

  cron.schedule("*/1 * * * *", async () => {
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
        return el;
      });

      //check if the last shot url matches the current url
      let lastShot = await DribbbleShot.findOne({
        shotID: shotLink.getProperty("href"),
      });

      if (!lastShot) {
        // await DribbbleShot.create({ shotID: shotLink.getProperty("href") });
        const channels = await getInspirationChannels();
        channels.map((channel) => {
          // send shot link to channel if it exists
          if (channel) {
            channel.send(shotLink.getProperty("href"));
          }
        });
      }
      return browser.close();
    } catch (error) {
      console.error(error);
    }
  });
});

client.login(process.env.BOT_TOKEN);
