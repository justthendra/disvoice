import { User } from 'discord.js';
export declare enum SourceType {
    YouTube = "youtube",
    Spotify = "spotify",
    SoundCloud = "soundcloud",
    Direct = "direct"
}
export interface Track {
    title: string;
    url: string;
    duration: number;
    thumbnail?: string;
    requester: User;
    source: SourceType;
    author?: string;
}
export interface QueueOptions {
    loop?: boolean;
    loopQueue?: boolean;
    shuffle?: boolean;
    autoplay?: boolean;
}
export interface PlayerOptions {
    leaveOnEmpty?: boolean;
    leaveOnEmptyCooldown?: number;
    leaveOnEnd?: boolean;
    volume?: number;
}
export interface PlayerEvents {
    trackStart: (track: Track) => void;
    trackEnd: (track: Track) => void;
    queueEnd: () => void;
    error: (error: Error, track?: Track) => void;
    volumeChange: (oldVolume: number, newVolume: number) => void;
}
export interface SearchResult {
    tracks: Track[];
    playlist?: {
        name: string;
        url: string;
        tracks: Track[];
    };
}
declare module 'play-dl';
declare module 'ytsr';
declare module 'spotify-url-info';
//# sourceMappingURL=index.d.ts.map