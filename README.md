# disvoice 🎵

Universal music player for Discord bots with support for **YouTube**, **Spotify**, **SoundCloud** and more platforms.

## Features

✨ **Multi-Platform Support**
- 🎥 YouTube (videos & playlists)
- 🎵 Spotify (tracks, albums & playlists)
- 🔊 SoundCloud (tracks & playlists)

🎮 **Complete Playback Control**
- Play, pause, resume, stop
- Skip tracks
- Volume control
- Queue management (shuffle, loop, history)

🚀 **Easy to Use**
- Simple API
- TypeScript support
- Event-based system
- Auto-disconnect on idle

## Installation

```bash
npm install disvoice
```

### Required Dependencies

```bash
npm install discord.js @discordjs/voice
```

You also need to install additional dependencies for audio processing:

```bash
npm install sodium-native # or libsodium-wrappers
npm install @discordjs/opus # or opusscript
npm install ffmpeg-static
```

## Quick Start

```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const { MusicPlayer } = require('disvoice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const player = new MusicPlayer({
  leaveOnEmpty: true,
  leaveOnEmptyCooldown: 60000,
  volume: 50
});

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!play')) {
    const query = message.content.slice(6);
    const channel = message.member?.voice.channel;
    
    if (!channel) {
      return message.reply('You need to be in a voice channel!');
    }

    try {
      const result = await player.play(query, message.author, channel);
      
      if (result.playlist) {
        message.reply(`Added **${result.tracks.length}** tracks from playlist: **${result.playlist.name}**`);
      } else {
        message.reply(`Added to queue: **${result.tracks[0].title}**`);
      }
    } catch (error) {
      message.reply(`Error: ${error.message}`);
    }
  }
});

client.login('YOUR_BOT_TOKEN');
```

## API Reference

### MusicPlayer

Main class for music playback.

#### Constructor

```typescript
const player = new MusicPlayer(options?: PlayerOptions);
```

**PlayerOptions:**
```typescript
{
  leaveOnEmpty?: boolean;        // Leave when queue is empty (default: true)
  leaveOnEmptyCooldown?: number; // Cooldown before leaving in ms (default: 60000)
  leaveOnEnd?: boolean;          // Leave when track ends and queue is empty (default: true)
  volume?: number;               // Default volume 0-100 (default: 100)
}
```

#### Methods

##### play(query, requester, channel?)
Play a track or add to queue.

```typescript
await player.play(
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  message.author,
  voiceChannel
);
```

**Supported formats:**
- YouTube URLs (videos & playlists)
- Spotify URLs (tracks, albums & playlists)
- SoundCloud URLs (tracks & playlists)
- Search queries (searches YouTube)

##### skip()
Skip current track.

```typescript
const nextTrack = player.skip();
```

##### pause()
Pause playback.

```typescript
player.pause();
```

##### resume()
Resume playback.

```typescript
player.resume();
```

##### stop()
Stop playback and clear queue.

```typescript
player.stop();
```

##### setVolume(volume)
Set volume (0-100).

```typescript
player.setVolume(75);
```

##### getVolume()
Get current volume.

```typescript
const volume = player.getVolume();
```

##### disconnect()
Disconnect from voice channel.

```typescript
player.disconnect();
```

##### getQueue()
Get the queue instance.

```typescript
const queue = player.getQueue();
const tracks = queue.getTracks();
```

##### getCurrentTrack()
Get currently playing track.

```typescript
const track = player.getCurrentTrack();
```

### Queue

Queue management system.

#### Methods

##### add(track)
Add a track to queue.

```typescript
queue.add(track);
```

##### addMany(tracks)
Add multiple tracks.

```typescript
queue.addMany([track1, track2, track3]);
```

##### skip()
Skip current track.

```typescript
const nextTrack = queue.skip();
```

##### clear()
Clear entire queue.

```typescript
queue.clear();
```

##### shuffle()
Shuffle the queue.

```typescript
queue.shuffle();
```

##### getTracks()
Get all tracks in queue.

```typescript
const tracks = queue.getTracks();
```

##### size()
Get queue size.

```typescript
const size = queue.size();
```

##### setOptions(options)
Set queue options.

```typescript
queue.setOptions({
  loop: true,
  loopQueue: false,
  shuffle: false
});
```

## Events

The MusicPlayer emits various events you can listen to:

```typescript
// Track started playing
player.on('trackStart', (track) => {
  console.log(`Now playing: ${track.title}`);
});

// Track ended
player.on('trackEnd', (track) => {
  console.log(`Finished: ${track.title}`);
});

// Queue ended (no more tracks)
player.on('queueEnd', () => {
  console.log('Queue is empty');
});

// Error occurred
player.on('error', (error, track) => {
  console.error('Error:', error.message);
});

// Volume changed
player.on('volumeChange', (oldVolume, newVolume) => {
  console.log(`Volume: ${oldVolume} → ${newVolume}`);
});
```

## Examples

### Play YouTube Video

```javascript
await player.play(
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  message.author,
  voiceChannel
);
```

### Play Spotify Playlist

```javascript
await player.play(
  'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
  message.author,
  voiceChannel
);
```

### Search and Play

```javascript
await player.play(
  'lofi hip hop radio',
  message.author,
  voiceChannel
);
```

### Queue Management

```javascript
// Get queue
const queue = player.getQueue();

// Show queue
const tracks = queue.getTracks();
tracks.forEach((track, i) => {
  console.log(`${i + 1}. ${track.title} - ${track.author}`);
});

// Shuffle queue
queue.shuffle();

// Enable loop
queue.setOptions({ loop: true });

// Clear queue
queue.clear();
```

### Full Bot Example

See [examples/basic-bot.js](examples/basic-bot.js) for a complete working example.

## Platform Support

### YouTube
- ✅ Direct video links
- ✅ Playlist links
- ✅ Search queries
- ✅ Live streams

### Spotify
- ✅ Track links
- ✅ Album links
- ✅ Playlist links
- ⚠️ Searches YouTube to find equivalent tracks (Spotify doesn't provide audio streams)

### SoundCloud
- ✅ Track links
- ✅ Playlist links
- ✅ Search queries

## TypeScript Support

This package is written in TypeScript and includes type definitions.

```typescript
import { MusicPlayer, Track, PlayerOptions, Queue } from 'disvoice';

const player: MusicPlayer = new MusicPlayer({
  volume: 50
});
```

## Troubleshooting

### Bot doesn't join voice channel
Make sure your bot has the necessary permissions:
- `CONNECT` - to join voice channels
- `SPEAK` - to play audio

### No audio playing
1. Install required voice dependencies:
```bash
npm install sodium-native @discordjs/opus ffmpeg-static
```

2. Make sure FFmpeg is installed on your system

### Spotify tracks not playing
Spotify links are automatically converted to YouTube searches. If a track doesn't play, it might not be available on YouTube.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
