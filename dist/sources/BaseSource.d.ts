import { Track, SearchResult } from '../types';
import { User } from 'discord.js';
export declare abstract class BaseSource {
    abstract name: string;
    /**
     * Validate if the URL belongs to this source
     */
    abstract validate(query: string): boolean;
    /**
     * Search for tracks
     */
    abstract search(query: string, requester: User): Promise<SearchResult>;
    /**
     * Get stream URL for a track
     */
    abstract getStream(track: Track): Promise<string | NodeJS.ReadableStream>;
    /**
     * Check if query is a URL
     */
    protected isURL(query: string): boolean;
}
//# sourceMappingURL=BaseSource.d.ts.map