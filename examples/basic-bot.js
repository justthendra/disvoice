const { Client, GatewayIntentBits } = require('discord.js');
const { MusicPlayer } = require('../dist/index');

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Create music player
const player = new MusicPlayer({
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 60000,
    leaveOnEnd: true,
    volume: 50
});

// Player events
player.on('trackStart', (track) => {
    console.log(`🎵 Now playing: ${track.title} by ${track.author || 'Unknown'}`);
});

player.on('trackEnd', (track) => {
    console.log(`✅ Finished: ${track.title}`);
});

player.on('queueEnd', () => {
    console.log('📭 Queue is empty');
});

player.on('error', (error, track) => {
    console.error(`❌ Error playing ${track?.title || 'track'}:`, error.message);
});

player.on('volumeChange', (oldVolume, newVolume) => {
    console.log(`🔊 Volume changed: ${oldVolume}% → ${newVolume}%`);
});

// Bot ready event
client.on('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log('🎵 Music bot is ready!');
    console.log('\nCommands:');
    console.log('  !play <url or search> - Play a song');
    console.log('  !skip - Skip current song');
    console.log('  !pause - Pause playback');
    console.log('  !resume - Resume playback');
    console.log('  !stop - Stop and clear queue');
    console.log('  !queue - Show queue');
    console.log('  !np - Now playing');
    console.log('  !volume <0-100> - Set volume');
    console.log('  !shuffle - Shuffle queue');
    console.log('  !loop - Toggle loop');
    console.log('  !leave - Disconnect');
});

// Message handler
client.on('messageCreate', async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;

    const args = message.content.split(' ');
    const command = args[0].toLowerCase();

    // Play command
    if (command === '!play') {
        const query = args.slice(1).join(' ');

        if (!query) {
            return message.reply('❌ Please provide a URL or search query!');
        }

        const channel = message.member?.voice.channel;
        if (!channel) {
            return message.reply('❌ You need to be in a voice channel!');
        }

        try {
            message.reply('🔍 Searching...');

            const result = await player.play(query, message.author, channel);

            if (result.playlist) {
                message.reply(`✅ Added **${result.tracks.length}** tracks from playlist: **${result.playlist.name}**`);
            } else {
                const track = result.tracks[0];
                message.reply(`✅ Added to queue: **${track.title}** by **${track.author || 'Unknown'}**`);
            }
        } catch (error) {
            message.reply(`❌ Error: ${error.message}`);
        }
    }

    // Skip command
    if (command === '!skip') {
        const nextTrack = player.skip();
        if (nextTrack) {
            message.reply(`⏭️ Skipped! Now playing: **${nextTrack.title}**`);
        } else {
            message.reply('❌ No more tracks in queue!');
        }
    }

    // Pause command
    if (command === '!pause') {
        const paused = player.pause();
        if (paused) {
            message.reply('⏸️ Paused playback');
        } else {
            message.reply('❌ Already paused or not playing');
        }
    }

    // Resume command
    if (command === '!resume') {
        const resumed = player.resume();
        if (resumed) {
            message.reply('▶️ Resumed playback');
        } else {
            message.reply('❌ Already playing or not paused');
        }
    }

    // Stop command
    if (command === '!stop') {
        player.stop();
        message.reply('⏹️ Stopped playback and cleared queue');
    }

    // Queue command
    if (command === '!queue') {
        const queue = player.getQueue();
        const tracks = queue.getTracks();

        if (tracks.length === 0) {
            return message.reply('📭 Queue is empty!');
        }

        const current = queue.current();
        let queueText = current ? `**Now Playing:**\n🎵 ${current.title} by ${current.author || 'Unknown'}\n\n` : '';
        queueText += '**Queue:**\n';

        tracks.slice(0, 10).forEach((track, i) => {
            queueText += `${i + 1}. ${track.title} by ${track.author || 'Unknown'}\n`;
        });

        if (tracks.length > 10) {
            queueText += `\n... and ${tracks.length - 10} more tracks`;
        }

        message.reply(queueText);
    }

    // Now playing command
    if (command === '!np') {
        const current = player.getCurrentTrack();

        if (!current) {
            return message.reply('❌ Nothing is playing right now!');
        }

        message.reply(`🎵 **Now Playing:**\n${current.title}\n**By:** ${current.author || 'Unknown'}\n**Source:** ${current.source}`);
    }

    // Volume command
    if (command === '!volume') {
        const volume = parseInt(args[1]);

        if (isNaN(volume) || volume < 0 || volume > 100) {
            return message.reply('❌ Please provide a volume between 0 and 100!');
        }

        player.setVolume(volume);
        message.reply(`🔊 Volume set to ${volume}%`);
    }

    // Shuffle command
    if (command === '!shuffle') {
        const queue = player.getQueue();
        queue.shuffle();
        message.reply('🔀 Shuffled the queue!');
    }

    // Loop command
    if (command === '!loop') {
        const queue = player.getQueue();
        const options = queue.getOptions();
        queue.setOptions({ loop: !options.loop });
        message.reply(`🔁 Loop ${!options.loop ? 'enabled' : 'disabled'}!`);
    }

    // Leave command
    if (command === '!leave') {
        player.disconnect();
        message.reply('👋 Disconnected from voice channel');
    }
});

// Login
const TOKEN = process.env.DISCORD_TOKEN || 'YOUR_BOT_TOKEN_HERE';
client.login(TOKEN);
