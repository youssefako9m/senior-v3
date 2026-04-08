process.on('unhandledRejection', (reason) => {
    if (reason?.message?.includes("reading 'all'")) return;
    console.error('Unhandled Rejection:', reason);
});

const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

const GUILD_ID = process.env.GUILD;
const CHANNEL_ID = process.env.CHANNEL;
const tokens = process.env.TOKEN ? process.env.TOKEN.split(',') : [];

if (tokens.length === 0) {
    console.error("ERROR: No tokens found in Railway Variables!");
    process.exit(1);
}

tokens.forEach((token, index) => {
    const t = token.trim();
    if (!t) return;

    const client = new Client({ checkUpdate: false, patchVoice: true });

    client.on('ready', async () => {
        // Simplified logging to avoid backtick errors
        console.log("Account " + (index + 1) + " is online: " + client.user.tag);
        joinVC(client);
    });

    client.on('voiceStateUpdate', async (oldState, newState) => {
        if (oldState.member.id !== client.user.id) return;
        if (!newState.channelId  newState.channelId !== CHANNEL_ID) {
            console.log("Account " + client.user.username + " rejoining VC...");
            setTimeout(() => joinVC(client), 5000);
        }
    });

    client.login(t).catch(err => {
        console.error("Token " + (index + 1) + " login failed.");
    });
});

function joinVC(client) {
    const guild = client.guilds.cache.get(GUILD_ID);
    const voiceChannel = guild?.channels.cache.get(CHANNEL_ID);

    if (!guild  !voiceChannel) {
        return console.error("Server or Channel ID is wrong in Railway variables!");
    }

    try {
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true
        });
        console.log("Account " + client.user.username + " joined: " + voiceChannel.name);
    } catch (error) {
        console.error("Voice Error for " + client.user.username + ":", error);
    }
}
