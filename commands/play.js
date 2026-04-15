const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} = require('@discordjs/voice');

const { spawn } = require('child_process');
const playdl = require('play-dl');

module.exports = async (message, query, client) => {
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) return message.reply('Join a voice channel first');

  if (!query || !query.trim()) {
    return message.reply('Provide a song name or URL!');
  }

  let url = query;
  let title = "Unknown";

  try {
    if (!query.startsWith("http")) {
      const results = await playdl.search(query, {
        limit: 1,
        source: { youtube: "video" }
      });

      if (!results.length) return message.reply('No results found');

      url = results[0].url;
      title = results[0].title;

      message.reply(`🎶 Found: ${title}`);
    }
  } catch (err) {
    console.error("Search error:", err);
    return message.reply('Search failed');
  }

  const song = { title, url };

  // Queue setup
  if (!client.queue.has(message.guild.id)) {
    client.queue.set(message.guild.id, {
      songs: [],
      player: null,
      connection: null
    });
  }

  const queue = client.queue.get(message.guild.id);
  queue.songs.push(song);

  message.reply(`🎵 Added to queue: ${song.title}`);

  if (!queue.connection) {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    queue.connection = connection;
    playSong(queue, message.guild.id, client);
  }
};

async function playSong(queue, guildId, client) {
  if (!queue.songs.length) {
    if (queue.connection) {
      try { queue.connection.destroy(); } catch {}
    }
    client.queue.delete(guildId);
    return;
  }

  const song = queue.songs[0];
  console.log("Now playing:", song.url);

  let stream;

  try {
    const ytProcess = spawn('yt-dlp', [
      '-o', '-',
      '-f', 'bestaudio',
      song.url
    ], { stdio: ['ignore', 'pipe', 'ignore'] });

    stream = ytProcess.stdout;
  } catch (err) {
    console.error("yt-dlp error:", err);
    queue.songs.shift();
    return playSong(queue, guildId, client);
  }

  const resource = createAudioResource(stream);
  const player = createAudioPlayer();

  player.play(resource);
  queue.connection.subscribe(player);
  queue.player = player;

  player.on(AudioPlayerStatus.Idle, () => {
    queue.songs.shift();
    playSong(queue, guildId, client);
  });

  player.on('error', (err) => {
    console.error("Player error:", err);
    queue.songs.shift();
    playSong(queue, guildId, client);
  });
}