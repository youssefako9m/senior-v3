// 1. THE CRASH PATCH (Must be at the very top)
process.on('unhandledRejection', (reason, promise) => {
    if (reason?.message?.includes("reading 'all'")) return;
    console.error('Unhandled Rejection:', reason);
});

const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client({ 
    checkUpdate: false,
    patchVoice: true // Helps with voice stability
});
const config = require('./config.json');

// Using Railway Variables
const TOKEN = process.env.TOKEN  config.Token;
const GUILD_ID = process.env.GUILD  config.Guild;
const CHANNEL_ID = process.env.CHANNEL  config.Channel;

client.on('ready', async () => {
    console.log(Successfully logged in as: ${client.user.tag});
    joinVC();
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    // Only care if it's OUR account moving
    if (oldState.member.id !== client.user.id) return;

    // If disconnected or moved to a different channel, join back
    if (!newState.channelId  newState.channelId !== CHANNEL_ID) {
        console.log("Detected voice state change. Rejoining target channel...");
        setTimeout(() => joinVC(), 5000); // 5 second delay to prevent spamming
    }
});

function joinVC() {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return console.error("Error: Guild ID not found. Check your Railway Variables!");

    const voiceChannel = guild.channels.cache.get(CHANNEL_ID);
    if (!voiceChannel) return console.error("Error: Channel ID not found. Check your Railway Variables!");

    try {
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true
        });
        console.log(Joined VC: ${voiceChannel.name} in ${guild.name});
    } catch (error) {
        console.error("Failed to join voice channel:", error);
    }
}

// Security Check & Login
if (!TOKEN  TOKEN === "tokenhere" 
 TOKEN === "") {
    console.error("ERROR: No Token found in Railway Variables!");
} else {
    client.login(TOKEN).catch(err => {
        console.error("Login Failed! Check if your Token is still valid.");
    });
}
