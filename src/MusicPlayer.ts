import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnection,
  AudioPlayer,
  VoiceConnectionStatus,
  entersState,
  StreamType
} from '@discordjs/voice';
import ffmpegPath from 'ffmpeg-static';
process.env.FFMPEG_PATH = ffmpegPath || 'ffmpeg';
import { VoiceBasedChannel, User } from 'discord.js';
import { EventEmitter } from 'events';
import { Queue } from './Queue';
import { Track, PlayerOptions, PlayerEvents, SearchResult, SourceType } from './types';
import { YouTubeSource } from './sources/YouTubeSource';
import { SpotifySource } from './sources/SpotifySource';
import { SoundCloudSource } from './sources/SoundCloudSource';
import { BaseSource } from './sources/BaseSource';

export class MusicPlayer extends EventEmitter {
  private connection: VoiceConnection | null = null;
  private player: AudioPlayer;
  private queue: Queue;
  private options: PlayerOptions;
  private sources: BaseSource[];
  private currentVolume: number = 100;
  private leaveTimeout: NodeJS.Timeout | null = null;
  private isPlaying: boolean = false;

  constructor(options: PlayerOptions = {}) {
    super();
    
    this.options = {
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 60000,
      leaveOnEnd: true,
      volume: 100,
      ...options
    };

    this.currentVolume = this.options.volume || 100;
    this.player = createAudioPlayer();
    this.queue = new Queue();
    
    // Initialize sources
    this.sources = [
      new YouTubeSource(),
      new SpotifySource(),
      new SoundCloudSource()
    ];

    this.setupPlayerEvents();
  }

  /**
   * Connect to a voice channel
   */
  connect(channel: VoiceBasedChannel): VoiceConnection {
    if (this.connection) {
      this.connection.destroy();
    }

    this.connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator as any
    });

    this.connection.subscribe(this.player);

    this.connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(this.connection!, VoiceConnectionStatus.Signalling, 5000),
          entersState(this.connection!, VoiceConnectionStatus.Connecting, 5000),
        ]);
      } catch {
        this.connection?.destroy();
        this.connection = null;
      }
    });

    return this.connection;
  }

  /**
   * Play a track or search query
   */
  async play(query: string, requester: User, channel?: VoiceBasedChannel): Promise<SearchResult> {
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
    } else {
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
  private async playNext(): Promise<void> {
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
        if (track.source === SourceType.YouTube) return s instanceof YouTubeSource;
        if (track.source === SourceType.Spotify) return s instanceof SpotifySource;
        if (track.source === SourceType.SoundCloud) return s instanceof SoundCloudSource;
        return false;
      }) || this.sources[0];

      const stream = await source.getStream(track);
      
      const resource = createAudioResource(stream as any, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true
      });

      resource.volume?.setVolume(this.currentVolume / 100);

      this.player.play(resource);
      this.isPlaying = true;
      this.emit('trackStart', track);
    } catch (error) {
      console.error('Error playing track:', error);
      this.emit('error', error as Error, track);
      await this.playNext(); // Try next track
    }
  }

  /**
   * Skip the current track
   */
  skip(): Track | null {
    const nextTrack = this.queue.skip();
    this.player.stop();
    return nextTrack;
  }

  /**
   * Pause playback
   */
  pause(): boolean {
    return this.player.pause();
  }

  /**
   * Resume playback
   */
  resume(): boolean {
    return this.player.unpause();
  }

  /**
   * Stop playback and clear queue
   */
  stop(): void {
    this.queue.clear();
    this.player.stop();
    this.isPlaying = false;
  }

  /**
   * Set volume (0-100)
   */
  setVolume(volume: number): void {
  const oldVolume = this.currentVolume;
  this.currentVolume = Math.max(0, Math.min(100, volume));
  
  // Apply volume to current resource if playing
  if (this.player.state.status === AudioPlayerStatus.Playing) {
    const resource = (this.player.state as any).resource;
    if (resource && resource.volume) {
      resource.volume.setVolume(this.currentVolume / 100);
    }
  }
  
  this.emit('volumeChange', oldVolume, this.currentVolume);
}

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.currentVolume;
  }

  /**
   * Get the queue
   */
  getQueue(): Queue {
    return this.queue;
  }

  /**
   * Disconnect from voice channel
   */
  disconnect(): void {
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
  private scheduleLeave(): void {
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
  private setupPlayerEvents(): void {
    this.player.on(AudioPlayerStatus.Idle, () => {
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
  getCurrentTrack(): Track | null {
    return this.queue.current();
  }

  /**
   * Check if player is connected
   */
  isConnected(): boolean {
    return this.connection !== null;
  }

  /**
   * Check if currently playing
   */
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}
