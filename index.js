process.on('unhandledRejection', (reason) => {
    if (reason?.message?.includes("reading 'all'")) return;
    console.error('Unhandled Rejection:', reason);
});

const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

// 1. Get IDs from Railway Variables
const GUILD_ID = process.env.GUILD;
const CHANNEL_ID = process.env.CHANNEL;

// 2. Get Tokens (split by comma)
const tokens = process.env.TOKEN ? process.env.TOKEN.split(',') : [];

if (tokens.length === 0) {
    console.error("ERROR: No tokens found in Railway Variables!");
    process.exit(1);
}

// 3. Start a client for EVERY token
tokens.forEach((token, index) => {
    const t = token.trim();
    if (!t) return;

    const client = new Client({ checkUpdate: false, patchVoice: true });

    client.on('ready', async () => {
        // FIXED LINE BELOW (Uses backticks  )
        console.log([Account ${index + 1}] logged in as: ${client.user.tag});
        joinVC(client);
    });

    client.on('voiceStateUpdate', async (oldState, newState) => {
        if (oldState.member.id !== client.user.id) return;
        if (!newState.channelId  newState.channelId !== CHANNEL_ID) {
            console.log([${client.user.username}] Disconnected. Rejoining...);
            setTimeout(() => joinVC(client), 5000);
        }
    });

    client.login(t).catch(err => {
        console.error([Token ${index + 1}] Login Failed! Check your token.);
    });
});

function joinVC(client) {
    const guild = client.guilds.cache.get(GUILD_ID);
    const voiceChannel = guild?.channels.cache.get(CHANNEL_ID);

    if (!guild  !voiceChannel) {
        return console.error([${client.user?.username || 'Unknown'}] Server or Channel not found!);
    }

    try {
        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true
        });
        console.log([${client.user.username}] Joined: ${voiceChannel.name});
    } catch (error) {
        console.error([${client.user.username}] Voice Error:, error);
    }
}
