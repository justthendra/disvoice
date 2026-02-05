import { BaseSource } from './BaseSource';
import { Track, SearchResult } from '../types';
import { User } from 'discord.js';
export declare class SpotifySource extends BaseSource {
    name: string;
    validate(query: string): boolean;
    search(query: string, requester: User): Promise<SearchResult>;
    private spotifyToYouTube;
    private searchYouTube;
    getStream(track: Track): Promise<NodeJS.ReadableStream>;
}
//# sourceMappingURL=SpotifySource.d.ts.map