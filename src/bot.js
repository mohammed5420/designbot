require("dotenv").config();
const axios = require("axios");
const { Client, Intents, Channel } = require("discord.js");

const puppeteer = require("puppeteer");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const PREFIX = "$";
// const channel = new Channel(client);
client.on("ready", () => {
  console.log("Bot is ready");

  const channel = client.channels.cache.get("953334253142290432");

  // console.log(channel)
  let lastShotId = "";
  setInterval(() => {
    (async () => {
      const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
      const page = await browser.newPage();
      await page.goto("https://dribbble.com/shots", { timeout: 0 });
      let shotID = await page.$eval(".shot-thumbnail", (el) => {
        return el.getAttribute("data-thumbnail-id");
      });
      let shotLink = await page.$eval(".dribbble-link js-shot-link", (el) => {
        return el.href;
      });
      console.log(shotID);
      if (lastShotId !== shotID) {
        lastShotId = shotID;
        let rowHref = await page.$eval(
          ".js-thumbnail-placeholder > img",
          (el) => el.src
        );
        channel.send(
          `Shot Link: https://dribbble.com${shotLink} \n ${rowHref}`
        );
      } else {
        await browser.close();
      }

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
    })();
  }, 35000);
});

// client.on("messageCreate", (message) => {
//   if (message.content == "design") {
//     message.reply({
//       files: [
//         "https://cdn.dribbble.com/userupload/2846072/file/original-3c5a87a25f237249ffdd9174b8c988f3.png?compress=1&resize=1200x900",
//       ],
//     });
//   }
// });

client.login(process.env.BOT_TOKEN);
