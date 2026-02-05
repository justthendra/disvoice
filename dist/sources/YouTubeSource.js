"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeSource = void 0;
// @ts-nocheck
const BaseSource_1 = require("./BaseSource");
const types_1 = require("../types");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class YouTubeSource extends BaseSource_1.BaseSource {
    constructor() {
        super(...arguments);
        this.name = "YouTube";
    }
    validate(query) {
        if (!this.isURL(query))
            return false;
        const urlPatterns = [
            /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
            /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=.+$/,
            /^(https?:\/\/)?(www\.)?youtu\.be\/.+$/,
            /^(https?:\/\/)?(www\.)?youtube\.com\/playlist\?list=.+$/,
        ];
        return urlPatterns.some((pattern) => pattern.test(query));
    }
    extractVideoId(url) {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match)
                return match[1];
        }
        return null;
    }
    async search(query, requester) {
        try {
            // If it's a URL, get info directly
            if (this.validate(query)) {
                const videoId = this.extractVideoId(query);
                if (videoId) {
                    try {
                        const info = await this.getVideoInfo(`https://www.youtube.com/watch?v=${videoId}`);
                        if (info) {
                            const track = {
                                title: info.title || "Unknown",
                                url: `https://www.youtube.com/watch?v=${videoId}`,
                                duration: info.duration || 0,
                                thumbnail: info.thumbnail,
                                requester,
                                source: types_1.SourceType.YouTube,
                                author: info.channel || "Unknown",
                            };
                            return { tracks: [track] };
                        }
                    }
                    catch (e) {
                        console.error("Error getting video info:", e);
                    }
                }
            }
            // Search for the query using yt-dlp
            const searchResults = await this.searchVideos(query);
            if (searchResults.length === 0) {
                return { tracks: [] };
            }
            const tracks = searchResults.map((video) => ({
                title: video.title || "Unknown",
                url: video.url,
                duration: video.duration || 0,
                thumbnail: video.thumbnail,
                requester,
                source: types_1.SourceType.YouTube,
                author: video.channel || "Unknown",
            }));
            return { tracks };
        }
        catch (error) {
            console.error("YouTube search error:", error);
            return { tracks: [] };
        }
    }
    async getVideoInfo(url) {
        try {
            const { stdout } = await execAsync(`yt-dlp --dump-json --no-playlist "${url}"`, { maxBuffer: 10 * 1024 * 1024 });
            const info = JSON.parse(stdout);
            return {
                title: info.title,
                duration: info.duration,
                thumbnail: info.thumbnail,
                channel: info.channel || info.uploader,
            };
        }
        catch (error) {
            console.error("yt-dlp info error:", error);
            return null;
        }
    }
    async searchVideos(query) {
        try {
            const { stdout } = await execAsync(`yt-dlp --dump-json --flat-playlist --no-playlist --extractor-args "youtube:player_client=android_vr" "ytsearch5:${query}"`, { maxBuffer: 10 * 1024 * 1024 });
            const lines = stdout.trim().split("\n").filter(Boolean);
            return lines.map((line) => {
                const info = JSON.parse(line);
                return {
                    title: info.title,
                    url: info.url || `https://www.youtube.com/watch?v=${info.id}`,
                    duration: info.duration,
                    thumbnail: info.thumbnail || info.thumbnails?.[0]?.url,
                    channel: info.channel || info.uploader,
                };
            });
        }
        catch (error) {
            console.error("yt-dlp search error:", error);
            return [];
        }
    }
    async getStream(track) {
        if (!track.url) {
            throw new Error("Track URL is undefined");
        }
        return new Promise((resolve, reject) => {
            // Use android_vr client which doesn't require PO Token
            const ytdlp = (0, child_process_1.spawn)("yt-dlp", [
                "-f",
                "bestaudio",
                "-o",
                "-",
                "--no-playlist",
                "--quiet",
                "--extractor-args",
                "youtube:player_client=android_vr",
                track.url,
            ]);
            ytdlp.on("error", (error) => {
                console.error("yt-dlp spawn error:", error);
                reject(new Error("Failed to spawn yt-dlp"));
            });
            ytdlp.stderr.on("data", (data) => {
                console.error("yt-dlp stderr:", data.toString());
            });
            ytdlp.stdout.once("readable", () => {
                resolve(ytdlp.stdout);
            });
            ytdlp.on("close", (code) => {
                if (code !== 0 && code !== null) {
                    console.error(`yt-dlp exited with code ${code}`);
                }
            });
            setTimeout(() => {
                if (!ytdlp.stdout.readable) {
                    ytdlp.kill();
                    reject(new Error("yt-dlp timed out"));
                }
            }, 30000);
        });
    }
    parseDuration(duration) {
        const parts = duration.split(":").map(Number);
        if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        else if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        }
        return parts[0] || 0;
    }
}
exports.YouTubeSource = YouTubeSource;
//# sourceMappingURL=YouTubeSource.js.map