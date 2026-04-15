const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.queue = new Map();

client.once('clientReady', (c) => {
  console.log(`Discord username: ${c.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith('!') || message.author.bot) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const query = args.join(' ');

  if (command === 'play') {
    require('./commands/play')(message, query, client);
  }
  } else if (command === 'stop') {
    require('./commands/stop')(message, client);
  }
});

client.login(process.env.DISCORD_TOKEN);
