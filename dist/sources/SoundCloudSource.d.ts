import { BaseSource } from './BaseSource';
import { Track, SearchResult } from '../types';
import { User } from 'discord.js';
export declare class SoundCloudSource extends BaseSource {
    name: string;
    validate(query: string): boolean;
    search(query: string, requester: User): Promise<SearchResult>;
    getStream(track: Track): Promise<string | NodeJS.ReadableStream>;
}
//# sourceMappingURL=SoundCloudSource.d.ts.map