# Maya Music Bot

Maya is a simple and powerful Discord music bot designed to play songs, manage queues, and provide a smooth music experience inside your Discord server.

Features
- Play music from YouTube
-  Clear queue
-  Lightweight and fast performance
  
Setup Instructions
  1. Clone the repository
    git clone https://github.com/yourusername/maya-music-bot.git
    cd maya-music-bot
  2. Install dependencies
     npm install
  4. Create a .env file in the root directory and add
     DISCORD_TOKEN=your_bot_token_here
  5. Run bot
     node index.js
 
Bot Commands
 !play <song>  (Play a song from YouTube)
 !stop (Stop playback and clear queue)

Requirements
  Node.js v16+
  Discord Bot Token
  FFmpeg installed

Dependencies
  discord.js
  @discordjs/voice
  ytdl-core
  dotenv

 Made with ❤️ by Anik Halder
