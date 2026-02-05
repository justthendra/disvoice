import { BaseSource } from "./BaseSource";
import { Track, SearchResult } from "../types";
import { User } from "discord.js";
export declare class YouTubeSource extends BaseSource {
    name: string;
    validate(query: string): boolean;
    private extractVideoId;
    search(query: string, requester: User): Promise<SearchResult>;
    private getVideoInfo;
    private searchVideos;
    getStream(track: Track): Promise<NodeJS.ReadableStream>;
    private parseDuration;
}
//# sourceMappingURL=YouTubeSource.d.ts.map