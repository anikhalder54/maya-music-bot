module.exports = (message, client) => {
  const queue = client.queue.get(message.guild.id);

  if (!queue) return message.reply('❌ Nothing to stop');

  queue.songs = [];

  if (queue.player) queue.player.stop();
  if (queue.connection) {
    try { queue.connection.destroy(); } catch {}
  }

  client.queue.delete(message.guild.id);

  message.reply('🛑 Stopped and cleared queue');
};