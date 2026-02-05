import { VoiceConnection } from '@discordjs/voice';
import { VoiceBasedChannel, User } from 'discord.js';
import { EventEmitter } from 'events';
import { Queue } from './Queue';
import { Track, PlayerOptions, SearchResult } from './types';
export declare class MusicPlayer extends EventEmitter {
    private connection;
    private player;
    private queue;
    private options;
    private sources;
    private currentVolume;
    private leaveTimeout;
    private isPlaying;
    constructor(options?: PlayerOptions);
    /**
     * Connect to a voice channel
     */
    connect(channel: VoiceBasedChannel): VoiceConnection;
    /**
     * Play a track or search query
     */
    play(query: string, requester: User, channel?: VoiceBasedChannel): Promise<SearchResult>;
    /**
     * Play the next track in queue
     */
    private playNext;
    /**
     * Skip the current track
     */
    skip(): Track | null;
    /**
     * Pause playback
     */
    pause(): boolean;
    /**
     * Resume playback
     */
    resume(): boolean;
    /**
     * Stop playback and clear queue
     */
    stop(): void;
    /**
     * Set volume (0-100)
     */
    setVolume(volume: number): void;
    /**
     * Get current volume
     */
    getVolume(): number;
    /**
     * Get the queue
     */
    getQueue(): Queue;
    /**
     * Disconnect from voice channel
     */
    disconnect(): void;
    /**
     * Schedule automatic leave
     */
    private scheduleLeave;
    /**
     * Setup player event handlers
     */
    private setupPlayerEvents;
    /**
     * Get current track
     */
    getCurrentTrack(): Track | null;
    /**
     * Check if player is connected
     */
    isConnected(): boolean;
    /**
     * Check if currently playing
     */
    isCurrentlyPlaying(): boolean;
}
//# sourceMappingURL=MusicPlayer.d.ts.map