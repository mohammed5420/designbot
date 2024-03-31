import { BaseGuildTextChannel, ChannelType, Client } from 'discord.js';
import puppeteer from 'puppeteer';
import 'dotenv/config';
//create a discord client to send messages to channels inside bot servers
const client = new Client({
  intents: ['GuildMessages', 'Guilds', 'GuildMessageTyping'],
});

client.on('ready', async () => {
  console.log('Bot is ready');

  client.guilds.cache.map(async (guild) => {
    const existedChannel = guild.channels.cache.find(
      (channel) => channel.name === '💡-inspirations'
    );

    if (!existedChannel)
      await guild.channels.create({
        name: '💡-inspirations',
      });
  });

  const getInspirationChannels = async () => {
    //map over guilds and find channel with id of name inspiration
    const inspirationChannels = client.guilds.cache.map((guild) => {
      const channel = guild.channels.cache.find(
        (channel) =>
          channel.name === '💡-inspirations' &&
          channel.type === ChannelType.GuildText
      );
      if (!channel) return;
      return channel as BaseGuildTextChannel;
    });

    return inspirationChannels;
  };

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-extensions',
      ],
    });
    const page = await browser.newPage();
    await page.goto('https://dribbble.com/shots/popular', {
      waitUntil: 'load',
      timeout: 0,
    });

    const shotID = await page.evaluate(() => {
      const shot = document.querySelector('.shot-thumbnail-link');
      return shot?.getAttribute('href');
    });

    if (!shotID) return browser.close();

    const inspirationChannels = await getInspirationChannels();

    inspirationChannels.map(async (channel) => {
      if (channel) await channel.send(`https://dribbble.com${shotID}`);
    });

    return browser.close();
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.BOT_TOKEN);
