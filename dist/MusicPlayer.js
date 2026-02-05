"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicPlayer = void 0;
const voice_1 = require("@discordjs/voice");
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
process.env.FFMPEG_PATH = ffmpeg_static_1.default || 'ffmpeg';
const events_1 = require("events");
const Queue_1 = require("./Queue");
const types_1 = require("./types");
const YouTubeSource_1 = require("./sources/YouTubeSource");
const SpotifySource_1 = require("./sources/SpotifySource");
const SoundCloudSource_1 = require("./sources/SoundCloudSource");
class MusicPlayer extends events_1.EventEmitter {
    constructor(options = {}) {
        super();
        this.connection = null;
        this.currentVolume = 100;
        this.leaveTimeout = null;
        this.isPlaying = false;
        this.options = {
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 60000,
            leaveOnEnd: true,
            volume: 100,
            ...options
        };
        this.currentVolume = this.options.volume || 100;
        this.player = (0, voice_1.createAudioPlayer)();
        this.queue = new Queue_1.Queue();
        // Initialize sources
        this.sources = [
            new YouTubeSource_1.YouTubeSource(),
            new SpotifySource_1.SpotifySource(),
            new SoundCloudSource_1.SoundCloudSource()
        ];
        this.setupPlayerEvents();
    }
    /**
     * Connect to a voice channel
     */
    connect(channel) {
        if (this.connection) {
            this.connection.destroy();
        }
        this.connection = (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        this.connection.subscribe(this.player);
        this.connection.on(voice_1.VoiceConnectionStatus.Disconnected, async () => {
            try {
                await Promise.race([
                    (0, voice_1.entersState)(this.connection, voice_1.VoiceConnectionStatus.Signalling, 5000),
                    (0, voice_1.entersState)(this.connection, voice_1.VoiceConnectionStatus.Connecting, 5000),
                ]);
            }
            catch {
                this.connection?.destroy();
                this.connection = null;
            }
        });
        return this.connection;
    }
    /**
     * Play a track or search query
     */
    async play(query, requester, channel) {
        if (channel && !this.connection) {
            this.connect(channel);
        }
        if (!this.connection) {
            throw new Error('Not connected to a voice channel');
        }
        // Clear leave timeout if exists
        if (this.leaveTimeout) {
            clearTimeout(this.leaveTimeout);
            this.leaveTimeout = null;
        }
        // Find appropriate source
        const source = this.sources.find(s => s.validate(query)) || this.sources[0]; // Default to YouTube
        const result = await source.search(query, requester);
        if (result.tracks.length === 0) {
            throw new Error('No tracks found');
        }
        // Add tracks to queue
        if (result.playlist) {
            this.queue.addMany(result.tracks);
        }
        else {
            this.queue.addMany(result.tracks);
        }
        // If not currently playing, start playing
        if (!this.isPlaying) {
            await this.playNext();
        }
        return result;
    }
    /**
     * Play the next track in queue
     */
    async playNext() {
        const track = this.queue.next();
        if (!track) {
            this.isPlaying = false;
            this.emit('queueEnd');
            if (this.options.leaveOnEnd) {
                this.scheduleLeave();
            }
            return;
        }
        try {
            const source = this.sources.find(s => {
                if (track.source === types_1.SourceType.YouTube)
                    return s instanceof YouTubeSource_1.YouTubeSource;
                if (track.source === types_1.SourceType.Spotify)
                    return s instanceof SpotifySource_1.SpotifySource;
                if (track.source === types_1.SourceType.SoundCloud)
                    return s instanceof SoundCloudSource_1.SoundCloudSource;
                return false;
            }) || this.sources[0];
            const stream = await source.getStream(track);
            const resource = (0, voice_1.createAudioResource)(stream, {
                inputType: voice_1.StreamType.Arbitrary,
                inlineVolume: true
            });
            resource.volume?.setVolume(this.currentVolume / 100);
            this.player.play(resource);
            this.isPlaying = true;
            this.emit('trackStart', track);
        }
        catch (error) {
            console.error('Error playing track:', error);
            this.emit('error', error, track);
            await this.playNext(); // Try next track
        }
    }
    /**
     * Skip the current track
     */
    skip() {
        const nextTrack = this.queue.skip();
        this.player.stop();
        return nextTrack;
    }
    /**
     * Pause playback
     */
    pause() {
        return this.player.pause();
    }
    /**
     * Resume playback
     */
    resume() {
        return this.player.unpause();
    }
    /**
     * Stop playback and clear queue
     */
    stop() {
        this.queue.clear();
        this.player.stop();
        this.isPlaying = false;
    }
    /**
     * Set volume (0-100)
     */
    setVolume(volume) {
        const oldVolume = this.currentVolume;
        this.currentVolume = Math.max(0, Math.min(100, volume));
        // Apply volume to current resource if playing
        if (this.player.state.status === voice_1.AudioPlayerStatus.Playing) {
            const resource = this.player.state.resource;
            if (resource && resource.volume) {
                resource.volume.setVolume(this.currentVolume / 100);
            }
        }
        this.emit('volumeChange', oldVolume, this.currentVolume);
    }
    /**
     * Get current volume
     */
    getVolume() {
        return this.currentVolume;
    }
    /**
     * Get the queue
     */
    getQueue() {
        return this.queue;
    }
    /**
     * Disconnect from voice channel
     */
    disconnect() {
        if (this.leaveTimeout) {
            clearTimeout(this.leaveTimeout);
            this.leaveTimeout = null;
        }
        this.stop();
        this.connection?.destroy();
        this.connection = null;
    }
    /**
     * Schedule automatic leave
     */
    scheduleLeave() {
        if (this.leaveTimeout) {
            clearTimeout(this.leaveTimeout);
        }
        if (this.options.leaveOnEmpty) {
            this.leaveTimeout = setTimeout(() => {
                this.disconnect();
            }, this.options.leaveOnEmptyCooldown || 60000);
        }
    }
    /**
     * Setup player event handlers
     */
    setupPlayerEvents() {
        this.player.on(voice_1.AudioPlayerStatus.Idle, () => {
            const currentTrack = this.queue.current();
            if (currentTrack) {
                this.emit('trackEnd', currentTrack);
            }
            this.playNext();
        });
        this.player.on('error', (error) => {
            console.error('Audio player error:', error);
            this.emit('error', new Error(error.message), this.queue.current() || undefined);
            this.playNext();
        });
    }
    /**
     * Get current track
     */
    getCurrentTrack() {
        return this.queue.current();
    }
    /**
     * Check if player is connected
     */
    isConnected() {
        return this.connection !== null;
    }
    /**
     * Check if currently playing
     */
    isCurrentlyPlaying() {
        return this.isPlaying;
    }
}
exports.MusicPlayer = MusicPlayer;
//# sourceMappingURL=MusicPlayer.js.map