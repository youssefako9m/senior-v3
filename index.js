const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client({ checkUpdate: false });
const config = require('./config.json');

// This part tells the bot to use Railway Variables first
const TOKEN = process.env.TOKEN || config.Token;
const GUILD_ID = process.env.GUILD || config.Guild;
const CHANNEL_ID = process.env.CHANNEL || config.Channel;

client.on('ready', async () => {
  console.log(`Successfully logged in as: ${client.user.tag}`);
  
  // Try to join VC immediately on startup
  joinVC();
});

// If you get kicked or the connection drops, this joins back
client.on('voiceStateUpdate', async (oldState, newState) => {
  if (oldState.member.id !== client.user.id) return;
  
  if (!newState.channelId || newState.channelId !== CHANNEL_ID) {
    console.log("Disconnected or moved. Rejoining target channel...");
    joinVC();
  }
});

function joinVC() {
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) return console.error("Error: Guild (Server) ID not found or account is not in that server.");
  
  const voiceChannel = guild.channels.cache.get(CHANNEL_ID);
  if (!voiceChannel) return console.error("Error: Voice Channel ID not found.");

  try {
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: true // Set to false if you want your mic to be 'open'
    });
    console.log(`Joined VC: ${voiceChannel.name} in ${guild.name}`);
  } catch (error) {
    console.error("Failed to join voice channel:", error);
  }
}

// Log in using the Token from Railway
if (!TOKEN || TOKEN === "tokenhere" || TOKEN === "") {
    console.error("ERROR: No Token found. Make sure you added 'TOKEN' to Railway Variables!");
} else {
    client.login(TOKEN);
}
