require("dotenv").config();
const axios = require("axios");
const { Client, Intents, Channel } = require("discord.js");
const fs = require("fs");
const puppeteer = require("puppeteer");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// const channel = new Channel(client);
client.on("ready", async () => {
  console.log("Bot is ready");

  const channel = client.channels.cache.get("953334253142290432");

  setInterval(async () => {
    //Lunch puppeteer headless browser
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto("https://dribbble.com/shots/popular", {
      waitUntil: "load",
      timeout: 0,
    });

    //Get The last shot link from data.json file
    let { lastShotLink } = await JSON.parse(
      fs.readFileSync("./src/data.json", "utf-8")
    );
    console.log("LastShotLink => ", lastShotLink);
    //Get Current the shot link
    let shotLink = await page.$eval(".shot-thumbnail-link", (el) => {
      return el.href;
    });

    if (lastShotLink == shotLink) {
      return await browser.close();
    }
    //Write the current shot link into data file
    await fs.writeFileSync(
      "./src/data.json",
      JSON.stringify({ lastShotLink: shotLink }),
      "utf-8"
    );
    await channel.send(`Shot Link: ${shotLink}`);
  }, 35000);
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
