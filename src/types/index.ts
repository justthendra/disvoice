import { VoiceConnection, AudioPlayer } from '@discordjs/voice';
import { User } from 'discord.js';

export enum SourceType {
  YouTube = 'youtube',
  Spotify = 'spotify',
  SoundCloud = 'soundcloud',
  Direct = 'direct'
}

export interface Track {
  title: string;
  url: string;
  duration: number; // in seconds
  thumbnail?: string;
  requester: User;
  source: SourceType;
  author?: string;
}

export interface QueueOptions {
  loop?: boolean; // Loop current track
  loopQueue?: boolean; // Loop entire queue
  shuffle?: boolean;
  autoplay?: boolean;
}

export interface PlayerOptions {
  leaveOnEmpty?: boolean; // Leave when queue is empty
  leaveOnEmptyCooldown?: number; // Cooldown in ms before leaving (default: 60000)
  leaveOnEnd?: boolean; // Leave when track ends and queue is empty
  volume?: number; // Default volume (0-100)
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

// @ts-ignore
declare module 'play-dl';
// @ts-ignore
declare module 'ytsr';
// @ts-ignore
declare module 'spotify-url-info';
